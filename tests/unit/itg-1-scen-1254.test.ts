import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx2Imp2Agent } from '../../src/logic/it-1';

// Mock AI Client for Tx2Imp2
interface MockAiClientResponse {
  processComplianceStatus: Array<{
    salesPersonId: string;
    complianceRate: number;
    deviationReason: string;
  }>;
  improvementProposals: Array<{
    salesPersonId: string;
    proposalContent: string;
    priority: string;
  }>;
  inferenceAccuracy: number;
}

class MockTx2Imp2AiClient {
  private inferenceAccuracy: number;
  private mockResponse: MockAiClientResponse;

  constructor(inferenceAccuracy: number = 85) {
    this.inferenceAccuracy = inferenceAccuracy;
    this.mockResponse = {
      processComplianceStatus: [
        {
          salesPersonId: 'SP001',
          complianceRate: 72,
          deviationReason: 'insufficient_followup_frequency',
        },
        {
          salesPersonId: 'SP002',
          complianceRate: 95,
          deviationReason: null,
        },
      ],
      improvementProposals: [
        {
          salesPersonId: 'SP001',
          proposalContent: 'increase_followup_calls_to_twice_weekly',
          priority: 'high',
        },
      ],
      inferenceAccuracy: this.inferenceAccuracy,
    };
  }

  async analyzeProcessCompliance(
    salesActivityData: unknown
  ): Promise<MockAiClientResponse> {
    return this.mockResponse;
  }

  getInferenceAccuracy(): number {
    return this.inferenceAccuracy;
  }
}

// Mock Audit Logger
interface AuditLogEntry {
  timestamp: string;
  event_type: string;
  agent_name: string;
  action_name?: string;
  status: string;
  proposal_status?: string;
  proposal_count?: number;
  details: Record<string, unknown>;
}

class MockAuditLogger {
  private logs: AuditLogEntry[] = [];

  logEvent(entry: AuditLogEntry): void {
    this.logs.push(entry);
  }

  getLogs(): AuditLogEntry[] {
    return this.logs;
  }

  clear(): void {
    this.logs = [];
  }
}

// SCEN-1254
describe('営業プロセス遵守状況の自動監視と改善提案の実行 AIエージェント', () => {
  test('SCEN-1254: エージェント実行ライフサイクル全体が時系列順で監査記録に残る', async () => {
    const auditLogger = new MockAuditLogger();
    const aiClient = new MockTx2Imp2AiClient(85);

    // Setup: テスト用のモック営業活動データ
    const salesActivityData = [
      {
        salesPersonId: 'SP001',
        visitCount: 8,
        proposalCount: 5,
        conversionRate: 40,
        processComplianceRate: 72,
      },
      {
        salesPersonId: 'SP002',
        visitCount: 15,
        proposalCount: 12,
        conversionRate: 75,
        processComplianceRate: 95,
      },
    ];

    // Execute: runTx2Imp2Agent を実行
    const result = await runTx2Imp2Agent(
      {
        salesActivityData,
        auditLogger,
        aiClient,
        managerReviewThresholdAccuracy: 95,
      },
      {
        logger: {
          info: (msg: string) => console.log('[INFO]', msg),
          error: (msg: string) => console.error('[ERROR]', msg),
        },
      }
    );

    // Verify: 監査ログを取得
    const logs = auditLogger.getLogs();

    // 1. エージェント開始イベントが記録されたか確認
    const startLog = logs.find((l) => l.event_type === 'AGENT_START');
    expect(startLog).toBeDefined();
    expect(startLog?.agent_name).toBe('tx-2-imp-2');
    expect(startLog?.status).toBe('started');
    expect(startLog?.timestamp).toBeDefined();

    // 2. 営業活動データ収集・分析アクション実行
    const dataCollectionLog = logs.find(
      (l) =>
        l.event_type === 'ACTION_EXECUTE' &&
        l.action_name ===
          '営業活動データを収集・分析し、プロセス遵守状況を自動判定する'
    );
    expect(dataCollectionLog).toBeDefined();
    expect(dataCollectionLog?.status).toBe('executed');

    // 3. 遵守率が低い担当者検出アクション実行
    const lowComplianceDetectionLog = logs.find(
      (l) =>
        l.event_type === 'ACTION_EXECUTE' &&
        l.action_name ===
          '遵守率が低い担当者や改善機会を検出する'
    );
    expect(lowComplianceDetectionLog).toBeDefined();
    expect(lowComplianceDetectionLog?.status).toBe('executed');

    // 4. 改善提案生成アクション実行
    const proposalGenerationLog = logs.find(
      (l) =>
        l.event_type === 'ACTION_EXECUTE' &&
        l.action_name ===
          '成功事例と比較して具体的な改善提案を生成する'
    );
    expect(proposalGenerationLog).toBeDefined();
    expect(proposalGenerationLog?.status).toBe('executed');

    // 5. マネージャー確認待ち状態へ遷移
    const managerReviewLog = logs.find(
      (l) => l.event_type === 'HUMAN_REVIEW_REQUIRED'
    );
    expect(managerReviewLog).toBeDefined();
    expect(managerReviewLog?.proposal_status).toBe(
      'pending_manager_approval'
    );
    expect(managerReviewLog?.proposal_count).toBeGreaterThan(0);

    // 6. 営業担当者への通知アクション実行
    const notificationLog = logs.find(
      (l) =>
        l.event_type === 'ACTION_EXECUTE' &&
        l.action_name ===
          '提案内容を営業担当者に通知し、実行状況を追跡する'
    );
    expect(notificationLog).toBeDefined();
    expect(notificationLog?.status).toBe('executed');

    // 7. ダッシュボード可視化・マネージャー報告アクション実行
    const dashboardLog = logs.find(
      (l) =>
        l.event_type === 'ACTION_EXECUTE' &&
        l.action_name ===
          'プロセス遵守状況をダッシュボードで可視化し、マネージャーに報告する'
    );
    expect(dashboardLog).toBeDefined();
    expect(dashboardLog?.status).toBe('executed');

    // 8. エージェント完了イベントが記録されたか確認
    const completeLog = logs.find((l) => l.event_type === 'AGENT_COMPLETE');
    expect(completeLog).toBeDefined();
    expect(completeLog?.agent_name).toBe('tx-2-imp-2');
    expect(completeLog?.status).toBe('success');
    expect(completeLog?.details.completion_timestamp).toBeDefined();

    // 9. 時系列順序の確認
    const eventSequence = logs.map((l) => l.event_type);
    expect(eventSequence[0]).toBe('AGENT_START');
    expect(eventSequence).toContain('ACTION_EXECUTE');
    expect(eventSequence).toContain('HUMAN_REVIEW_REQUIRED');
    expect(eventSequence[eventSequence.length - 1]).toBe('AGENT_COMPLETE');

    // ACTION_EXECUTEが5つあるか確認
    const actionExecuteLogs = logs.filter(
      (l) => l.event_type === 'ACTION_EXECUTE'
    );
    expect(actionExecuteLogs.length).toBe(5);

    // 10. 必須フィールド検証
    logs.forEach((log) => {
      expect(log.timestamp).toBeDefined();
      expect(typeof log.timestamp).toBe('string');
      expect(log.event_type).toBeDefined();
      expect(log.agent_name).toBeDefined();
      expect(log.status).toBeDefined();
      expect(log.details).toBeDefined();
      expect(typeof log.details).toBe('object');
    });

    // 11. タイムスタンプが昇順か確認
    for (let i = 1; i < logs.length; i++) {
      const prevTime = new Date(logs[i - 1].timestamp).getTime();
      const currTime = new Date(logs[i].timestamp).getTime();
      expect(currTime).toBeGreaterThanOrEqual(prevTime);
    }

    // 12. 実行結果の検証
    expect(result).toBeDefined();
    expect(result.status).toBe('success');
    expect(result.processedSalesPersonCount).toBeGreaterThan(0);
    expect(result.proposalsGenerated).toBeGreaterThan(0);
  });
});