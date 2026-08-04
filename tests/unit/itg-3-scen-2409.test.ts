import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2409
  test('推論精度スコア算出機能 - 精度評価の計算過程で0除算が発生したとき、エラーが発生する', () => {
    const patternData = {
      totalSamples: 0,
      matchedSamples: 0,
      relevanceFeatures: {
        customerIndustry: 'Manufacturing',
        dealStage: 'Proposal',
        proposalType: 'Standard',
      },
    };

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn((): number => {
        const denominator = patternData.totalSamples;
        if (denominator === 0) {
          throw new Error('精度スコア計算に失敗しました：分母がゼロです');
        }
        return (patternData.matchedSamples / denominator) * 100;
      }),
    };

    expect(() => {
      evaluatePatternRelevance(patternData, aiRecommendationEngineStub);
    }).toThrow(/分母がゼロです/);
  });
});