import { calculateConversionRate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-779
  test('成約実績が1件の営業担当者の成約率が正しく計算される', () => {
    const employeeId = 'EMP001';
    const closedDeals = 1;
    const lostDeals = 9;

    const conversionRate = calculateConversionRate({
      employeeId,
      closedDeals,
      lostDeals,
    });

    expect(conversionRate).toBe(10.0);
  });
});