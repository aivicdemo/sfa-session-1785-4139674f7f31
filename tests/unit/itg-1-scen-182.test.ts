import { calculateSalesPerformanceAndGuidance } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-182: 成約率が100%の場合、最高パフォーマンス指標として判定される', () => {
    // Arrange: 成約率100%のテストデータを準備
    // 成約件数 = 提案件数 = 5件の場合
    const salesRepId = 'REP-001';
    const proposalCount = 5;
    const contractCount = 5;
    const proposalDeviationScore = 95; // 標準プロセス遵守度スコア（0-100）
    const customerResponseRate = 80; // 顧客反応率（0-100）

    const input = {
      salesRepId,
      proposalCount,
      contractCount,
      proposalDeviationScore,
      customerResponseRate,
    };

    // Act: 行動パターン分析・改善指導対象判定機能を実行
    const result = calculateSalesPerformanceAndGuidance(input);

    // Assert: パフォーマンス指標と等級を確認
    // 成約率 = contractCount / proposalCount = 5 / 5 = 100%
    // パフォーマンス指標 = 100（最高パフォーマンス）
    expect(result.performanceScore).toBe(100);

    // パフォーマンス等級が「最高」であることを確認
    expect(result.performanceRating).toBe('最高');

    // 改善指導対象フラグはfalseであることを確認
    expect(result.requiresGuidance).toBe(false);
  });
});