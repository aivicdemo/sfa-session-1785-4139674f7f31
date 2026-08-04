import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1269
  test('同じ入力データで2回判定を実行した場合に同じ結果が得られる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockRecommendationResult = {
      recommendationId: 'REC-2024-001',
      proposalApproach: '業務効率化ソリューション提案',
      confidenceScore: 85,
      reasoning: '製造業の大規模案件で業務効率化は高い優先度',
      timestamp: '2024-01-15T10:30:00Z',
    };

    mockAIEngine.generateRecommendation.mockReturnValue(mockRecommendationResult);

    const dealInput = {
      customerIndustry: '製造業',
      dealSize: 5000000,
      primaryChallenge: '業務効率化',
    };

    const firstResult = evaluateProposalValidity(dealInput, mockAIEngine);

    const secondResult = evaluateProposalValidity(dealInput, mockAIEngine);

    expect(firstResult.recommendationId).toBe(secondResult.recommendationId);
    expect(firstResult.recommendationId).toBe('REC-2024-001');

    expect(firstResult.proposalApproach).toBe(secondResult.proposalApproach);
    expect(firstResult.proposalApproach).toBe('業務効率化ソリューション提案');

    expect(firstResult.confidenceScore).toBe(secondResult.confidenceScore);
    expect(firstResult.confidenceScore).toBe(85);

    expect(firstResult.reasoning).toBe(secondResult.reasoning);
    expect(firstResult.reasoning).toBe('製造業の大規模案件で業務効率化は高い優先度');

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(dealInput);
  });
});