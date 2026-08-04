import { generatePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1997
  test('投資対効果スコアが0以下のとき、資料生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    const input = {
      customerId: 'CUST-12345',
      customerIndustry: '製造業',
      customerChallenge: '生産効率化',
      proposalAmount: 5000000,
      expectedEffect: 10000000,
      investmentReturnScore: 0,
    };

    expect(() =>
      generatePersuasionMaterial(input, mockAIEngine)
    ).toThrow(/投資対効果スコア/);
  });
});