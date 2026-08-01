import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-574
  test('[edge] 優先度スコアの計算機能 - 優先度スコアが最大値100になる場合、100として計算される', () => {
    const input = {
      customer_importance: 10,
      deal_amount: 10000000,
      contract_probability: 100,
      sales_staff_skill_level: 5,
    };

    const result = calculatePriorityScore(input);

    expect(result).toBe(100);
    expect(result).toBeLessThanOrEqual(100);
    expect(result).toBeGreaterThanOrEqual(100);
  });
});