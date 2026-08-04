import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  test('SCEN-1480: 購買日時が推奨内容作成日時より古いときエラーを返す', () => {
    const recommendationCreatedAt = new Date('2026-08-01T10:00:00Z');
    const purchaseRecord = {
      purchaseDate: new Date('2026-08-01T09:59:59Z'),
      quantity: 100,
      amount: 50000,
    };

    expect(() => {
      evaluatePurchaseHistoryDataQuality(purchaseRecord, recommendationCreatedAt);
    }).toThrow(/PURCHASE_DATE_BEFORE_RECOMMENDATION_DATE/);

    try {
      evaluatePurchaseHistoryDataQuality(purchaseRecord, recommendationCreatedAt);
    } catch (error: any) {
      expect(error.code).toBe('PURCHASE_DATE_BEFORE_RECOMMENDATION_DATE');
      expect(error.message).toContain('購買日時（2026-08-01T09:59:59Z）');
      expect(error.message).toContain('推奨内容の作成日時（2026-08-01T10:00:00Z）');
      expect(error.message).toContain('データが不正です');
    }
  });
});