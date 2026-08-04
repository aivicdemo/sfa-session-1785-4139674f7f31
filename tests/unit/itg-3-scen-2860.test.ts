import { evaluateProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2860
  test('推奨内容検証判定機能 - 標準プロセスとの乖離度が null のとき、エラーを返す', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const input = {
      proposalContent: {
        customerIndustry: 'IT',
        customerSize: 'large',
        proposedSolution: 'クラウド導入',
        proposedTiming: '2024-Q2',
      },
      standardProcessDeviationDegree: null,
      aiEngine: aiRecommendationEngineStub,
    };

    const result = evaluateProposalDeviation(input);

    expect(result.errorCode).toBe('DEVIATION_NULL_ERROR');
    expect(result.errorMessage).toMatch(/標準プロセスとの乖離度が未設定です/);
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});