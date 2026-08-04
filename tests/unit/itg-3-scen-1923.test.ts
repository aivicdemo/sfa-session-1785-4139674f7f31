import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1923
  it('商談IDが空文字列のときに根拠が生成されない', () => {
    const dealId = '';
    const mockEngine = {
      explainRecommendationReasoning: jest.fn()
    };

    const result = explainRecommendationReasoning(dealId, mockEngine);

    expect(mockEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(result).toEqual({
      reasoning: null,
      isGenerated: false,
      message: '根拠を生成できません'
    });
  });
});