import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2136
  test('推奨内容が空文字列のとき、検証エラーが発生する', () => {
    const emptyRecommendation = '';
    const customerId = 'CUST-12345';
    const dealId = 'DEAL-67890';

    expect(() => {
      explainRecommendationReasoning(emptyRecommendation, customerId, dealId);
    }).toThrow(/推奨内容/);
  });
});