import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1237
  test('提案根拠情報がnullのとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(() => ({
        recommendation: '提案内容',
        proposalReason: null,
        confidenceScore: 0.85,
      })),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const proposalData = mockAIRecommendationEngine.generateRecommendation();

    expect(() => {
      evaluateProposalValidity(proposalData, mockAIRecommendationEngine);
    }).toThrow(/提案根拠/);
  });
});