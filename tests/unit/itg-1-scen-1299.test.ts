import { runTx11Imp1Agent } from '../../src/logic/it-1';
import type { Tx11Imp1AiClient } from '../../src/agents/tx-11-imp-1/orchestrator';

const fetchMock = require('jest-fetch-mock');

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  // SCEN-1299
  test('AIの分類精度が設定閾値80%未満の場合、知識ベース登録前に人へエスカレーション', async () => {
    const caseId = 'case-001';
    const classificationAccuracy = 0.75;
    const accuracyThreshold = 0.80;
    const expectedAuditLogMessage = `Escalation triggered: Classification accuracy 75% below threshold 80% for case ID: ${caseId}`;

    const mockBusinessCase = {
      id: caseId,
      title: '大型案件の成約成功事例',
      description: '顧客の経営課題を深堀りして、カスタムソリューション提案により成約に至った事例',
      successFactors: ['初回面談で顧客の経営課題をヒアリング', '3回の提案準備会議を実施', 'CFOとのエグゼクティブ面談を実現'],
      failureFactors: [],
      closedDate: '2024-01-15T00:00:00Z',
      contractValue: 5000000,
    };

    const mockAiClient: Tx11Imp1AiClient = {
      analyzeSuccessAndFailureFactors: jest.fn().mockResolvedValue({
        successFactors: [
          { factor: '初回面談での深いヒアリング', confidence: 0.95 },
          { factor: '複数の提案ラウンド', confidence: 0.92 },
          { factor: 'エグゼクティブ面談アプローチ', confidence: 0.88 },
        ],
        failureFactors: [],
      }),
      matchExistingPatterns: jest.fn().mockResolvedValue({
        matchedPatternIds: ['pattern-002', 'pattern-005'],
        newPatternDetected: false,
        classificationAccuracy: classificationAccuracy,
        proposedCategory: 'Large Deal - Executive Approach',
      }),
      languageFactors: jest.fn().mockResolvedValue({
        standardizedSuccessFactors: [
          'エグゼクティブ層への深い課題ヒアリングと信頼構築',
          '複数ラウンドの提案検討プロセス',
          'C級経営層の意思決定者へのアクセス実現',
        ],
      }),
    };

    const input = {
      businessCaseData: mockBusinessCase,
      existingPatternsDatabase: [
        { id: 'pattern-002', category: 'Executive Engagement', matchScore: 0.82 },
        { id: 'pattern-005', category: 'Multi-Round Proposal', matchScore: 0.78 },
      ],
      classificationThreshold: accuracyThreshold,
    };

    const result = await runTx11Imp1Agent(input, mockAiClient);

    expect(result.status).toBe('escalation_required');
    expect(result.escalationReason).toBe('classification_accuracy_below_threshold');
    expect(result.classificationAccuracy).toBe(classificationAccuracy);
    expect(result.accuracyThreshold).toBe(accuracyThreshold);
    expect(result.knowledgeBaseRegistered).toBe(false);

    expect(result.handoverToHuman).toEqual({
      businessCaseId: caseId,
      accuracyScore: classificationAccuracy,
      proposedClassification: 'Large Deal - Executive Approach',
      matchedPatterns: ['pattern-002', 'pattern-005'],
      aiAnalysisResult: {
        successFactors: [
          { factor: '初回面談での深いヒアリング', confidence: 0.95 },
          { factor: '複数の提案ラウンド', confidence: 0.92 },
          { factor: 'エグゼクティブ面談アプローチ', confidence: 0.88 },
        ],
        failureFactors: [],
      },
      reason: 'Classification accuracy 75% is below the threshold of 80%. Manual review and correction required before knowledge base registration.',
    });

    expect(result.auditLog).toContain(expectedAuditLogMessage);

    expect(result.httpStatusCode).toBe(422);

    expect(mockAiClient.analyzeSuccessAndFailureFactors).toHaveBeenCalledWith(mockBusinessCase);
    expect(mockAiClient.matchExistingPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        businessCaseId: caseId,
      }),
      [
        { id: 'pattern-002', category: 'Executive Engagement', matchScore: 0.82 },
        { id: 'pattern-005', category: 'Multi-Round Proposal', matchScore: 0.78 },
      ]
    );

    expect(result.statusTransition).toEqual({
      from: 'processing',
      to: 'escalation_pending_human_review',
      timestamp: expect.any(String),
    });
  });
});