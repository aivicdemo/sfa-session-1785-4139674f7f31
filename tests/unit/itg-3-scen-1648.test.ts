import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1648
  test('推奨スコア算出機能 - 現在の提案内容が空オブジェクトのとき、エラーが発生する', () => {
    const emptyProposal = {};
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      evaluatePatternRelevance(emptyProposal, mockAIEngine);
    }).toThrow(/現在の提案内容が空|proposal object is empty/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});