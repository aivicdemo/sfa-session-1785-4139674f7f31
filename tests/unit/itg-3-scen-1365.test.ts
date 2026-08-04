import { generateRecommendationWithValidation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1365: [error] 実装可能性スコア算出機能 - 顧客の経営課題データが空のとき実装可能性スコアが計算できない', () => {
    const input = {
      customerId: 'CUST-00001',
      dealId: 'DEAL-00001',
      businessChallenges: '',
      budget: 5000000,
      timeline: '2024-Q3'
    };

    expect(() => {
      generateRecommendationWithValidation(input);
    }).toThrow(/経営課題/);
  });
});