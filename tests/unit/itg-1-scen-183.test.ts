import { analyzeAndDetermineSalesCoachingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-183: 商談進捗データが欠落している場合、該当担当者のスコアがデフォルト値に設定される', () => {
    // Arrange: 商談進捗データが欠落したテストデータを準備
    const incompleteNegotiationData = {
      negotiationId: 'NEG-001',
      salesRepId: 'SR-001',
      customerId: 'CUST-001',
      // 必須カラム（進捗ステータス、金額、進捗日時）を意図的に削除
      // progressStatus: undefined,
      // amount: undefined,
      // progressDateTime: undefined,
      createdAt: '2024-01-15T10:00:00Z'
    };

    const incompleteDealProgressData = [
      {
        dealId: 'DEAL-001',
        dealName: 'Test Deal',
        salesRepId: 'SR-001',
        customerId: 'CUST-001',
        // 進捗ステータスが欠落
        // progressStatus: 'proposal',
        contractAmount: undefined, // 金額が欠落
        // progressDateTime: undefined, // 進捗日時が欠落
        dealCreatedDate: '2024-01-10T09:00:00Z'
      }
    ];

    const dealRecords = [
      {
        dealId: 'DEAL-001',
        salesRepId: 'SR-001',
        dealStatus: 'active',
        createdDate: '2024-01-10T09:00:00Z'
      }
    ];

    // Act: 行動パターン分析・改善指導対象判定機能を実行
    const result = analyzeAndDetermineSalesCoachingTarget(
      'SR-001',
      incompleteDealProgressData,
      dealRecords,
      incompleteNegotiationData
    );

    // Assert: スコアがデフォルト値（50点）に設定され、判定ステータスが「未評価」であることを検証
    expect(result.scoreValue).toBe(50);
    expect(result.coachingTargetStatus).toBe('未評価');
    expect(result.salesRepId).toBe('SR-001');
    expect(result.recommendedAction).toMatch(/データ欠落/);
  });
});