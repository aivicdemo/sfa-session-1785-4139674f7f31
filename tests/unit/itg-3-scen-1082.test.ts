import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1082
  test('新規案件の顧客IDが空文字列のとき、推奨生成処理がエラーになる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealData = {
      customer_id: '',
      deal_name: 'テスト案件',
      deal_amount: 5000000,
      deal_stage: '提案段階',
      customer_industry: '金融',
      customer_size: '大企業',
    };

    expect(() => generateRecommendation(newDealData, mockAIEngine)).toThrow(/顧客ID/);
  });
});