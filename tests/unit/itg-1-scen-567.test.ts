import { calculateImportanceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-567: [edge] 重要度スコアの計算機能 - 重要度スコアが最小値0になる場合、0として計算される
  test('重要度スコアが最小値0で正確に計算されること', () => {
    const result = calculateImportanceScore({
      salesStage: 1,
      customerCompanyScale: 1,
      dealAmount: 0,
      daysUntilDeadline: 999,
    });

    expect(result).toBe(0);
    expect(Object.is(result, 0)).toBe(true);
    expect(Object.is(result, -0)).toBe(false);
  });
});