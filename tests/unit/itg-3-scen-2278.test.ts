import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2278
  test('[error] 推奨内容の根拠表示機能 - 照合評価結果が0件のとき、適合性判定の根拠を表示できずエラーになる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn().mockReturnValue({
        proposalApproach: 'Standard Enterprise Solution',
        confidenceScore: 85,
      }),
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        throw new Error('適合性判定の根拠データが見つかりません');
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
    };

    const newCaseInfo = {
      customerName: 'ABC Corporation',
      dealAmount: 5000000,
      industry: 'Manufacturing',
      dealConditionId: 'COND-001',
    };

    const recommendationResult = mockAIRecommendationEngine.generateRecommendation(
      newCaseInfo
    );

    expect(recommendationResult).toEqual({
      proposalApproach: 'Standard Enterprise Solution',
      confidenceScore: 85,
    });

    const reasoningRequestPayload = {
      recommendationId: 'REC-20240115-001',
      proposalApproach: recommendationResult.proposalApproach,
      confidenceScore: recommendationResult.confidenceScore,
      dealConditionId: newCaseInfo.dealConditionId,
    };

    expect(() => {
      explainRecommendationReasoning(
        reasoningRequestPayload,
        mockAIRecommendationEngine
      );
    }).toThrow(/適合性判定の根拠データが見つかりません/);

    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveReturnedWith(
      []
    );
  });
});