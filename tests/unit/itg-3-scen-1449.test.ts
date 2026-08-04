import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1449
  test('購買履歴データが0件の場合に空の配列と判定結果が正常に返される', () => {
    const emptyPurchaseHistory: any[] = [];

    const result = evaluatePurchaseHistoryDataQuality(emptyPurchaseHistory);

    expect(result).toEqual({
      data: [],
      isValid: true,
      message: '購買履歴データが0件です',
      qualityScore: 0
    });
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(0);
    expect(typeof result.isValid).toBe('boolean');
    expect(typeof result.qualityScore).toBe('number');
  });
});