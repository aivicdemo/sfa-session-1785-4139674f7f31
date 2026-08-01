import { describe, test, expect } from '@jest/globals';
import { calculateDealDeviationScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-793
  test('対象営業担当者の商談データが複数件のとき、全件を集計して乖離度を計算する', () => {
    const salesPersonId = 'A';
    const deals = [
      {
        dealId: 'A001',
        salesPersonId: 'A',
        targetAmount: 1000000,
        actualAmount: 950000,
      },
      {
        dealId: 'A002',
        salesPersonId: 'A',
        targetAmount: 800000,
        actualAmount: 850000,
      },
      {
        dealId: 'A003',
        salesPersonId: 'A',
        targetAmount: 1200000,
        actualAmount: 1100000,
      },
    ];

    const result = calculateDealDeviationScore(salesPersonId, deals);

    const totalTargetAmount = 3000000;
    const totalActualAmount = 2900000;
    const expectedDeviationScore = (totalActualAmount / totalTargetAmount) * 100 - 100;

    expect(result.deviationScore).toBeCloseTo(expectedDeviationScore, 2);
    expect(result.deviationScore).toBeCloseTo(-3.33, 2);
    expect(result.dealCount).toBe(3);
    expect(result.totalTargetAmount).toBe(totalTargetAmount);
    expect(result.totalActualAmount).toBe(totalActualAmount);
  });
});