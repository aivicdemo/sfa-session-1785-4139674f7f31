import { runTx12Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1317: [error] 営業データ分析から乖離検出までの自律実行 AIエージェント - 標準プロセス遵守率が目標値を大きく下回る場合のエスカレーション
  test('標準プロセス遵守率が75%（目標値90%を下回る）と検出された時点で、エスカレーション処理を発動し人への引き継ぎフローへ遷移する', async () => {
    fetchMock.resetMocks();

    // テスト用営業データの準備：標準プロセス遵守率が75%のテストデータセット
    const salesDatasetId = 'dataset-2024-01-15-001';
    const monthlyTrigger = {
      triggerType: 'monthly_meeting',
      triggeredAt: '2024-01-15T09:00:00Z',
    };

    // 営業データベースのモック：品質チェック処理
    fetchMock.mockResponseOnce(
      JSON.stringify({
        datasetId: salesDatasetId,
        qualityScore: 0.95,
        totalRecords: 1200,
        missingValues: 0,
        formatErrors: 0,
        duplicates: 2,
        status: 'quality_check_passed',
        checkedAt: '2024-01-15T09:05:00Z',
      }),
      { status: 200 }
    );

    // 営業行動パターン分析処理のモック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        analysisId: 'analysis-2024-01-15-001',
        salesRepCount: 15,
        contactFrequencyAvg: 8.2,
        proposalSuccessRateAvg: 0.62,
        followUpIntervalDaysAvg: 3.5,
        analyzedAt: '2024-01-15T09:15:00Z',
      }),
      { status: 200 }
    );

    // 営業プロセス標準書の参照のモック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        processId: 'process-standard-2024',
        steps: [
          { stepId: 'step-1', name: '初回接触', requiredFrequencyDaysMin: 7 },
          { stepId: 'step-2', name: '提案', requiredFrequencyDaysMin: 5 },
          { stepId: 'step-3', name: '交渉', requiredFrequencyDaysMin: 3 },
          { stepId: 'step-4', name: '成約', requiredFrequencyDaysMin: 1 },
        ],
        complianceTargetRate: 0.9,
      }),
      { status: 200 }
    );

    // 乖離分析のモック：標準プロセス遵守率が75%
    fetchMock.mockResponseOnce(
      JSON.stringify({
        deviationAnalysisId: 'deviation-2024-01-15-001',
        complianceRate: 0.75,
        targetComplianceRate: 0.9,
        complianceGap: 0.15,
        deviationDetails: [
          {
            salesRepId: 'rep-001',
            repName: '営業太郎',
            individualComplianceRate: 0.68,
          },
          {
            salesRepId: 'rep-002',
            repName: '営業花子',
            individualComplianceRate: 0.72,
          },
          {
            salesRepId: 'rep-003',
            repName: '営業次郎',
            individualComplianceRate: 0.85,
          },
        ],
        analyzedAt: '2024-01-15T09:25:00Z',
      }),
      { status: 200 }
    );

    // 成約実績データ取得のモック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        contractDatasetId: 'contract-2024-01',
        totalContracts: 85,
        averageContractRate: 0.58,
        contractsByComplianceLevel: {
          highCompliance: { count: 52, rate: 0.72 },
          mediumCompliance: { count: 28, rate: 0.45 },
          lowCompliance: { count: 5, rate: 0.15 },
        },
        analyzedAt: '2024-01-15T09:30:00Z',
      }),
      { status: 200 }
    );

    // エスカレーション処理：人への引き継ぎフロー開始
    fetchMock.mockResponseOnce(
      JSON.stringify({
        escalationId: 'escalation-2024-01-15-001',
        escalationDetectedAt: '2024-01-15T09:35:00Z',
        escalationReason:
          '標準プロセス遵守率が目標値（90%）を大きく下回るため、組織的な改善施策の検討が必要',
        detectedComplianceRate: 0.75,
        targetComplianceRate: 0.9,
        complianceGapPercentage: 15,
        datasetIdForAudit: salesDatasetId,
        calculationLogicReference:
          'compliance_rate_calculation_v1.2_2024',
        escalationNotificationStatus: 'pending_human_review',
        assignedToManagers: [
          { managerId: 'mgr-001', name: '営業管理職A', role: 'sales_manager' },
          { managerId: 'leader-001', name: '営業部長', role: 'sales_leader' },
        ],
      }),
      { status: 200 }
    );

    // 監査ログ記録のモック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        auditLogId: 'audit-2024-01-15-001',
        eventType: 'escalation_detected_and_paused',
        eventTimestamp: '2024-01-15T09:35:00Z',
        escalationCondition: '標準プロセス遵守率が目標値を大きく下回る',
        detectedValue: 0.75,
        targetValue: 0.9,
        transferTargets: [
          { targetId: 'mgr-001', targetRole: 'sales_manager' },
          { targetId: 'leader-001', targetRole: 'sales_leader' },
        ],
        processStatus: 'paused_awaiting_human_decision',
        recordedAt: '2024-01-15T09:35:00Z',
      }),
      { status: 200 }
    );

    // AIエージェント実行：runTx12Imp1Agent の呼び出し
    const result = await runTx12Imp1Agent({
      trigger: monthlyTrigger,
      salesDatasetId: salesDatasetId,
      operationContext: {
        executorId: 'ai-agent-1',
        executorRole: 'autonomous_analyst',
        executionStartedAt: '2024-01-15T09:00:00Z',
      },
    });

    // ========== 検証開始 ==========

    // 1. エスカレーション検出と処理中断の確認
    expect(result.escalationDetected).toBe(true);
    expect(result.escalationReason).toMatch(/標準プロセス遵守率が目標値/);

    // 2. 検出された標準プロセス遵守率（75%）の確認
    expect(result.detectedComplianceRate).toBe(0.75);

    // 3. 目標値との乖離幅（90%との差分15ポイント）の確認
    expect(result.targetComplianceRate).toBe(0.9);
    expect(result.complianceGapPercentage).toBe(15);

    // 4. エスカレーション理由の確認
    expect(result.escalationReason).toMatch(/組織的な改善施策の検討が必要/);

    // 5. 分析の根拠となったデータセットID、計算ロジックの記録の確認
    expect(result.auditTrail.datasetIdForAudit).toBe(salesDatasetId);
    expect(result.auditTrail.calculationLogicReference).toBe(
      'compliance_rate_calculation_v1.2_2024'
    );

    // 6. 営業管理者および営業部長への確認依頼フロー開始の確認
    expect(result.escalationNotification.status).toBe('pending_human_review');
    expect(result.escalationNotification.assignedManagers).toHaveLength(2);
    expect(result.escalationNotification.assignedManagers[0].role).toBe(
      'sales_manager'
    );
    expect(result.escalationNotification.assignedManagers[1].role).toBe(
      'sales_leader'
    );

    // 7. AIエージェントの自動実行が一時停止している状態の確認
    expect(result.agentProcessStatus).toBe('paused_awaiting_human_decision');

    // 8. 改善提案の生成・確定前に処理が中断されていることの確認
    expect(result.improvementProposals).toBeUndefined();
    expect(result.finalReportGenerated).toBe(false);

    // 9. システム監査ログにエスカレーション検出と処理一時停止が記録されていることの確認
    expect(result.auditLog.eventType).toBe(
      'escalation_detected_and_paused'
    );
    expect(result.auditLog.eventTimestamp).toBe('2024-01-15T09:35:00Z');
    expect(result.auditLog.escalationCondition).toMatch(
      /標準プロセス遵守率が目標値を大きく下回る/
    );
    expect(result.auditLog.detectedValue).toBe(0.75);
    expect(result.auditLog.targetValue).toBe(0.9);
    expect(result.auditLog.processStatus).toBe(
      'paused_awaiting_human_decision'
    );

    // 10. エスカレーション通知に含まれるべき情報の確認
    expect(result.escalationNotification.escalationId).toBe(
      'escalation-2024-01-15-001'
    );
    expect(result.escalationNotification.escalationDetectedAt).toBe(
      '2024-01-15T09:35:00Z'
    );

    // 11. 副作用（改善施策実行指示、個別指導対象者の通知など）がまだ確定されていないことの確認
    expect(result.sideEffectStatus).toBe('not_committed');
    expect(result.improvementActionsPending).toBe(true);
  });
});