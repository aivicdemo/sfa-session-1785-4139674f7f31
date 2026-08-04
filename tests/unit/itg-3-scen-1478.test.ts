import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1478: [error] 購買履歴データ品質判定機能 - 商品カテゴリが空文字のときエラーを返す
  test('商品カテゴリが空文字の場合、CATEGORY_EMPTYエラーを返す', () => {
    const purchaseRecord = {
      recordId: 'PR-001',
      category: '',
      quantity: 10,
      amount: 5000,
      purchaseDate: '2024-01-15'
    };

    expect(() => evaluatePurchaseHistoryDataQuality(purchaseRecord)).toThrow(/CATEGORY_EMPTY/);
  });
});