import { runTx10Imp1Agent } from '../../src/agents/tx-10-imp-1/orchestrator';
import type { Tx10Imp1AiClient } from '../../src/agents/tx-10-imp-1/types';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1285
  test('[error] 営業データ入力から問題検出・通知までの自律実行 AIエージェント - AIが判定不可能な複雑な提案内容の場合に副作用の確定前に人へ引き継ぐ', async () => {
    const mockAiClient: Tx10Imp1AiClient = {
      validateDataQuality: jest.fn().mockResolvedValue({
        isValid: true,
        score: 0.98,
        missingFields: [],
        formatErrors: [],
        duplicateDetected: false,
        duplicateReasons: [],
      }),
      analyzeProposal: jest.fn().mockResolvedValue({
        confidence: 0.25,
        judgmentStatus: 'UNCLASSIFIABLE',
        successPatternMatch: null,
        riskFactors: [],
        explanation:
          '複雑な提案内容のため人的判断が必要。顧客の業界固有の複雑な規制要件と技術仕様の組み合わせで既存ルールベースでは判定不可能',
        requiresManualReview: true,
      }),
      detectAnomalies: jest.fn(),
      generateAlert: jest.fn(),
      notifyManager: jest.fn(),
      recordAuditEvent: jest.fn(),
    };

    const salesDataInput = {
      salesRepId: 'SR-001',
      customerId: 'CUST-2024-001',
      proposalContent: {
        summary:
          '業界固有の複雑な規制要件（GDPR、金融規制、データローカライゼーション）と技術仕様（レガシーシステム統合、カスタムAPI、マルチテナント対応）の組み合わせに基づく提案',
        productCode: 'COMPLEX-PROD-001',
        estimatedRevenue: 500000,
        proposalDate: '2024-02-15T09:30:00Z',
      },
      customerContactLog: {
        lastContactDate: '2024-02-10T14:00:00Z',
        contactMethod: 'email',
        responseIndicator: 'pending_review',
      },
      timestamp: '2024-02-15T10:00:00Z',
    };

    const escalationHandler = jest.fn().mockResolvedValue({
      handoverTaskId: 'HANDOVER-2024-001',
      targetReviewerId: 'MGR-002',
      handoverCreatedAt: '2024-02-15T10:00:01Z',
      escalationReason: 'AI judgment impossible',
    });

    const auditLog = {
      events: [] as Array<{
        eventType: string;
        timestamp: string;
        details: string;
      }>,
      recordEvent: function (eventType: string, timestamp: string, details: string) {
        this.events.push({ eventType, timestamp, details });
      },
    };

    mockAiClient.recordAuditEvent.mockImplementation(
      (eventType: string, timestamp: string, details: string) => {
        auditLog.recordEvent(eventType, timestamp, details);
      }
    );

    const result = await runTx10Imp1Agent({
      aiClient: mockAiClient,
      salesDataInput,
      escalationHandler,
    });

    expect(result.escalated).toBe(true);
    expect(result.escalationReason).toBe('AI judgment impossible');
    expect(result.alertStatus).toBe('PENDING_HUMAN_REVIEW');
    expect(result.notificationSent).toBe(false);

    expect(escalationHandler).toHaveBeenCalledWith({
      reason: 'AI judgment impossible',
      proposalAnalysisResult: {
        confidence: 0.25,
        judgmentStatus: 'UNCLASSIFIABLE',
        explanation: expect.stringContaining('複雑な提案内容のため人的判断が必要'),
      },
      targetRole: 'manager',
      salesDataContext: salesDataInput,
    });

    const escalationTriggeredEvent = auditLog.events.find(
      (e) => e.eventType === 'Escalation triggered: AI judgment impossible'
    );
    expect(escalationTriggeredEvent).toBeDefined();
    expect(escalationTriggeredEvent?.details).toContain('提案内容分析ステップで判定不可能');

    const handoverEvent = auditLog.events.find(
      (e) => e.eventType === 'Handover initiated to human reviewer'
    );
    expect(handoverEvent).toBeDefined();
    expect(handoverEvent?.details).toContain('管理者への人的引き継ぎ');

    expect(mockAiClient.generateAlert).not.toHaveBeenCalled();
    expect(mockAiClient.notifyManager).not.toHaveBeenCalled();

    expect(result.handoverTaskId).toBe('HANDOVER-2024-001');
    expect(result.targetReviewerId).toBe('MGR-002');
  });
});