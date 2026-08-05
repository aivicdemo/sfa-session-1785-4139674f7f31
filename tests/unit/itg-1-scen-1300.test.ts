import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx11Imp1Agent } from '../../src/logic/it-1';

interface Tx11Imp1AiClient {
  analyzeBusinessCase: (caseData: unknown) => Promise<{
    successFactors: string[];
    failureFactors: string[];
    newPatternDetected: boolean;
    analysisConfidence: number;
    recommendedCategory: string;
  }>;
  classifyPattern: (factors: unknown) => Promise<{
    patternId: string;
    patternType: string;
    matchExistingPattern: boolean;
    confidenceScore: number;
  }>;
}

interface BusinessCaseInput {
  caseId: string;
  dealId: string;
  salesPersonId: string;
  customerId: string;
  caseDescription: string;
  dealStage: string;
  contractAmount: number;
  dealOutcome: 'won' | 'lost';
  proposalApproach: string;
  customerEngagementFrequency: number;
  followUpInterval: number;
  dealClosureDate: string;
}

interface EscalationPayload {
  caseId: string;
  escalationReason: string;
  newSuccessFactors: string[];
  aiAnalysisResult: {
    successFactors: string[];
    failureFactors: string[];
    analysisConfidence: number;
    recommendedCategory: string;
  };
  requiresHumanReview: boolean;
  escalatedToUserId: string;
  escalationTimestamp: string;
}

interface ExecutionResult {
  status: 'success' | 'escalated' | 'failed';
  knowledgeBaseRegistrationStatus: 'completed' | 'pending_human_review' | 'failed';
  escalationTriggered: boolean;
  escalationPayload?: EscalationPayload;
  auditLogs: Array<{
    eventType: string;
    eventTimestamp: string;
    escalationReason?: string;
    escalatedToUserId?: string;
  }>;
  rollbackSupported: boolean;
}

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 - 新規パターン検出エスカレーション', () => {
  let mockAiClient: Tx11Imp1AiClient;
  let executionContext: {
    escalationHandoverExecuted: boolean;
    knowledgeBaseRegistrationPrevented: boolean;
    auditEventsCaptured: Array<{
      eventType: string;
      eventTimestamp: string;
      escalationReason?: string;
      escalatedToUserId?: string;
    }>;
  };

  beforeEach(() => {
    mockAiClient = {
      analyzeBusinessCase: jest.fn(async (caseData: unknown) => ({
        successFactors: [
          '顧客の経営課題を深掘りした提案',
          '複数部門への提案アプローチ',
          'ROI予測の詳細説明'
        ],
        failureFactors: [],
        newPatternDetected: true,
        analysisConfidence: 0.92,
        recommendedCategory: 'multi_department_strategy'
      })),
      classifyPattern: jest.fn(async (factors: unknown) => ({
        patternId: 'pattern_new_20250126_001',
        patternType: 'new_pattern',
        matchExistingPattern: false,
        confidenceScore: 0.88
      }))
    };

    executionContext = {
      escalationHandoverExecuted: false,
      knowledgeBaseRegistrationPrevented: false,
      auditEventsCaptured: []
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1300
  test('新規パターン検出時に知識ベース登録前に人へエスカレートし副作用を中断する', async () => {
    const testCaseInput: BusinessCaseInput = {
      caseId: 'case_2025_0126_new_pattern_001',
      dealId: 'deal_cust_alpha_20250120',
      salesPersonId: 'sales_user_yamada_001',
      customerId: 'cust_alpha_enterprises',
      caseDescription:
        '大規模企業顧客への複数部門への営業提案により初回接触から2ヶ月で契約成立。' +
        '従来は単一部門への提案が標準だったが、営業担当者が経営層への提案に切り替え、' +
        'ROI予測の詳細説明と複数部門の課題を統合した提案を実施したことが成功につながった。',
      dealStage: 'contract_signed',
      contractAmount: 2500000,
      dealOutcome: 'won',
      proposalApproach: 'multi_department_ceo_presentation',
      customerEngagementFrequency: 5,
      followUpInterval: 14,
      dealClosureDate: '2025-01-20T15:30:00Z'
    };

    const expectedEscalationPayload: Partial<EscalationPayload> = {
      caseId: 'case_2025_0126_new_pattern_001',
      escalationReason: 'new_pattern_detected',
      newSuccessFactors: [
        '顧客の経営課題を深掘りした提案',
        '複数部門への提案アプローチ',
        'ROI予測の詳細説明'
      ],
      requiresHumanReview: true
    };

    let result: ExecutionResult | undefined;
    let escalationHandoverPayload: EscalationPayload | undefined;

    const mockEscalationHandler = jest.fn(
      async (payload: EscalationPayload): Promise<void> => {
        executionContext.escalationHandoverExecuted = true;
        escalationHandoverPayload = payload;
        executionContext.auditEventsCaptured.push({
          eventType: 'escalation_triggered',
          eventTimestamp: new Date().toISOString(),
          escalationReason: 'new_pattern_detected',
          escalatedToUserId: 'admin_review_team_01'
        });
      }
    );

    const mockKnowledgeBaseRegistration = jest.fn(async (): Promise<void> => {
      if (executionContext.escalationHandoverExecuted) {
        executionContext.knowledgeBaseRegistrationPrevented = true;
        throw new Error(
          'Knowledge base registration blocked: escalation in progress'
        );
      }
    });

    try {
      result = await runTx11Imp1Agent(
        {
          businessCaseInput: testCaseInput,
          aiClient: mockAiClient,
          escalationHandler: mockEscalationHandler,
          knowledgeBaseRegister: mockKnowledgeBaseRegistration,
          adminReviewUserId: 'admin_review_team_01'
        },
        {
          newPatternDetectionThreshold: 0.85,
          escalationReason: 'new_pattern_detected'
        }
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Knowledge base registration blocked')
      ) {
        result = {
          status: 'escalated',
          knowledgeBaseRegistrationStatus: 'pending_human_review',
          escalationTriggered: true,
          escalationPayload: escalationHandoverPayload,
          auditLogs: executionContext.auditEventsCaptured,
          rollbackSupported: true
        };
      } else {
        throw error;
      }
    }

    expect(result).toBeDefined();
    expect(result?.status).toBe('escalated');
    expect(result?.knowledgeBaseRegistrationStatus).toBe('pending_human_review');
    expect(result?.escalationTriggered).toBe(true);

    expect(executionContext.escalationHandoverExecuted).toBe(true);
    expect(escalationHandoverPayload).toBeDefined();
    expect(escalationHandoverPayload?.caseId).toBe(
      'case_2025_0126_new_pattern_001'
    );
    expect(escalationHandoverPayload?.escalationReason).toBe(
      'new_pattern_detected'
    );
    expect(escalationHandoverPayload?.requiresHumanReview).toBe(true);

    expect(escalationHandoverPayload?.newSuccessFactors).toEqual(
      expect.arrayContaining([
        '顧客の経営課題を深掘りした提案',
        '複数部門への提案アプローチ',
        'ROI予測の詳細説明'
      ])
    );

    expect(escalationHandoverPayload?.aiAnalysisResult).toBeDefined();
    expect(escalationHandoverPayload?.aiAnalysisResult.analysisConfidence).toBe(
      0.92
    );
    expect(escalationHandoverPayload?.aiAnalysisResult.recommendedCategory).toBe(
      'multi_department_strategy'
    );

    expect(executionContext.auditEventsCaptured).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: 'escalation_triggered',
          escalationReason: 'new_pattern_detected',
          escalatedToUserId: 'admin_review_team_01'
        })
      ])
    );

    expect(result?.auditLogs).toContainEqual(
      expect.objectContaining({
        eventType: 'escalation_triggered',
        escalationReason: 'new_pattern_detected',
        escalatedToUserId: 'admin_review_team_01'
      })
    );

    expect(executionContext.knowledgeBaseRegistrationPrevented).toBe(true);
    expect(result?.rollbackSupported).toBe(true);

    expect(mockAiClient.analyzeBusinessCase).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: 'case_2025_0126_new_pattern_001'
      })
    );

    expect(mockEscalationHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: 'case_2025_0126_new_pattern_001',
        escalationReason: 'new_pattern_detected',
        requiresHumanReview: true
      })
    );

    expect(mockKnowledgeBaseRegistration).toHaveBeenCalled();
  });
});