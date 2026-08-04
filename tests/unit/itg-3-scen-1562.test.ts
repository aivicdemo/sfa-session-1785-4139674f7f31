import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に適用可能な提案アプローチを推奨', () => {
  // SCEN-1562
  test('類似顧客マッチング処理 - 一致度スコアが100を超える値を返すとき、エラーが発生する', () => {
    const invalidMatchScore = 101;
    const customerId = 'CUST-12345';
    const dealConditions = {
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      timeline: 'Q2-2024',
    };

    const stubAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(invalidMatchScore),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    expect(() => {
      findSimilarPatterns(customerId, dealConditions, stubAIEngine);
    }).toThrow(/一致度スコア|match score|有効範囲|0-100|Invalid/);
  });
});