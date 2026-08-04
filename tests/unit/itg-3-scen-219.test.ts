import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-219
  test('過去商談データセットが 0 件のとき、推奨処理がエラーになる', () => {
    const newDealData = {
      customerIndustry: '製造業',
      budgetSize: 5000000,
      challenge: '業務効率化',
      dealStage: '初回接触',
      decisionMakerConfirmed: false,
    };

    const historicalDealsCount = 0;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [];

    expect(() => {
      generateRecommendation(
        newDealData,
        historicalDealsCount,
        mockAIEngine,
        mockPatternMaster
      );
    }).toThrow(/過去商談データ/);
  });
});