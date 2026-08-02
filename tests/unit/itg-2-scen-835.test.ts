import { calculateConversionRate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  // SCEN-835
  test('成約件数が0件で総商談件数が0件のとき、成約率は未定義値で返される', () => {
    const closedDeals = 0;
    const totalDeals = 0;

    const result = calculateConversionRate({
      closedDeals,
      totalDeals,
    });

    expect(result).toBeUndefined();
  });
});