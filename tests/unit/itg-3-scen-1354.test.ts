import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1354
  test('提案内容が空のとき照合処理がエラーになる', () => {
    const emptyProposal = '';
    const validConstraints = {
      budget: 1000000,
      industry: 'manufacturing',
      timeline: '3months'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      evaluatePatternRelevance(emptyProposal, validConstraints, mockAIEngine);
    }).toThrow(/提案内容が空/);

    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});