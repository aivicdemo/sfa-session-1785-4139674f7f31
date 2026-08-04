import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2775
  test('複数の成功パターンがマッチした場合、マッチ度スコアの高い順に根拠が並べられる', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_a',
          matchScore: 0.95,
          patternName: 'Pattern A'
        },
        {
          patternId: 'pattern_b',
          matchScore: 0.87,
          patternName: 'Pattern B'
        },
        {
          patternId: 'pattern_c',
          matchScore: 0.78,
          patternName: 'Pattern C'
        }
      ]),
      explainRecommendationReasoning: jest.fn()
        .mockResolvedValueOnce({
          patternId: 'pattern_a',
          explanation: '顧客業種と予算規模が過去事例と一致'
        })
        .mockResolvedValueOnce({
          patternId: 'pattern_b',
          explanation: '商談ステージと決定者属性が類似'
        })
        .mockResolvedValueOnce({
          patternId: 'pattern_c',
          explanation: '提案商品カテゴリが合致'
        })
    };

    const sampleDealCondition = {
      customerIndustry: '製造業',
      budget: 5000000,
      decisionMakerLevel: '経営層'
    };

    const result = displayRecommendationReasoning(
      sampleDealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      reasonings: [
        {
          rank: 1,
          explanation: '顧客業種と予算規模が過去事例と一致',
          matchScore: 0.95,
          patternId: 'pattern_a'
        },
        {
          rank: 2,
          explanation: '商談ステージと決定者属性が類似',
          matchScore: 0.87,
          patternId: 'pattern_b'
        },
        {
          rank: 3,
          explanation: '提案商品カテゴリが合致',
          matchScore: 0.78,
          patternId: 'pattern_c'
        }
      ]
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      sampleDealCondition
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});