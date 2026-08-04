import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨履歴記録機能', () => {
  test('SCEN-254: 推奨内容が null のとき、推奨履歴の記録処理がエラーになる', () => {
    const invalidInput = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      recommendationContent: null,
      timestamp: '2026-08-01T12:00:00Z',
    };

    expect(() => recordRecommendationHistory(invalidInput)).toThrow(/推奨内容/);
  });
});