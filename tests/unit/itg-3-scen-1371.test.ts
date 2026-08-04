import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1371
  test('推奨パターンマスタが空のとき根拠説明が生成できない', () => {
    const emptyRecommendationPatterns: never[] = [];

    const customerCondition = {
      industry: 'IT',
      budget: 5000000,
      challenge: 'DX推進',
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => {
        if (emptyRecommendationPatterns.length === 0) {
          throw new Error('参照可能な過去成功パターンが存在しません');
        }
        return '';
      }),
    };

    expect(() => {
      explainRecommendationReasoning(customerCondition, mockAIEngine);
    }).toThrow(/参照可能な過去成功パターンが存在しません/);
  });
});