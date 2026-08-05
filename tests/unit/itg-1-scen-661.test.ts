import { analyzeProposalAndCustomerResponsePatterns } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  test('SCEN-661: 提案フェーズと顧客対応フェーズの両方が標準プロセスから逸脱する場合、複合異常パターンが検出される', () => {
    // Arrange: 標準プロセスマスタデータを初期化
    const standardProcessMaster = {
      proposalPhase: {
        steps: [
          { position: 1, name: '要件ヒアリング' },
          { position: 2, name: '提案作成' },
          { position: 3, name: '提案提示' },
        ],
      },
      customerResponsePhase: {
        steps: [
          { position: 1, name: '初回接触' },
          { position: 2, name: 'ニーズ確認' },
          { position: 3, name: '合意形成' },
        ],
      },
    };

    // テスト用顧客データを作成
    const customerData = {
      customerId: 'TEST-661',
      customerName: 'テスト顧客661',
    };

    // 提案内容データを登録：提案フェーズのステップ順序を『提案作成→要件ヒアリング→提案提示』に設定（標準から逸脱）
    const proposalData = {
      proposalId: 'PROP-661-001',
      customerId: 'TEST-661',
      steps: [
        { position: 1, name: '提案作成', timestamp: '2024-01-15T10:00:00Z' },
        { position: 2, name: '要件ヒアリング', timestamp: '2024-01-15T10:30:00Z' },
        { position: 3, name: '提案提示', timestamp: '2024-01-15T11:00:00Z' },
      ],
    };

    // 顧客対応記録を登録：顧客対応フェーズのステップ順序を『合意形成→初回接触→ニーズ確認』に設定（標準から逸脱）
    const customerResponseData = {
      responseId: 'RESP-661-001',
      customerId: 'TEST-661',
      steps: [
        { position: 1, name: '合意形成', timestamp: '2024-01-15T14:00:00Z' },
        { position: 2, name: '初回接触', timestamp: '2024-01-15T14:30:00Z' },
        { position: 3, name: 'ニーズ確認', timestamp: '2024-01-15T15:00:00Z' },
      ],
    };

    // Act: 比較分析処理を実行
    const analysisResult = analyzeProposalAndCustomerResponsePatterns(
      'TEST-661',
      standardProcessMaster,
      proposalData,
      customerResponseData
    );

    // Assert: 分析結果に『複合異常パターン』が検出されることを検証
    expect(analysisResult).toEqual({
      customerId: 'TEST-661',
      analysisId: expect.any(String),
      timestamp: expect.any(String),
      anomalyDetected: true,
      anomalyType: '複合逸脱',
      proposalPhaseAnomalies: {
        detected: true,
        anomalyDescription: 'ステップ順序不正（位置2→1→3）',
        detailedAnomalies: [
          {
            stepName: '提案作成',
            expectedPosition: 2,
            actualPosition: 1,
            deviation: -1,
          },
          {
            stepName: '要件ヒアリング',
            expectedPosition: 1,
            actualPosition: 2,
            deviation: 1,
          },
        ],
      },
      customerResponsePhaseAnomalies: {
        detected: true,
        anomalyDescription: 'ステップ順序不正（位置3→1→2）',
        detailedAnomalies: [
          {
            stepName: '合意形成',
            expectedPosition: 3,
            actualPosition: 1,
            deviation: -2,
          },
          {
            stepName: '初回接触',
            expectedPosition: 1,
            actualPosition: 2,
            deviation: 1,
          },
        ],
      },
      severity: '高',
      recommendedAction:
        '提案プロセスと対応プロセスの整合性を確認し、標準プロセスへの是正が必要',
      proposalPhaseComplianceScore: 33.33,
      customerResponsePhaseComplianceScore: 33.33,
      overallComplianceScore: 33.33,
    });
  });
});