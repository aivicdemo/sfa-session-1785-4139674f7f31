import { generateDecisionGuidance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-554: 同じ入力で2回実行したとき同じ指導方針が返される', () => {
    // Stub setup: AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn((input) => ({
        recommendedApproach: 'Initial Contact with Executive Brief',
        confidenceScore: 0.87,
        similarPatterns: [
          {
            patternId: 'PAT-2024-001',
            matchScore: 0.92,
            industry: 'Technology',
            companySize: 'Enterprise',
            successRate: 0.89,
          },
          {
            patternId: 'PAT-2024-002',
            matchScore: 0.78,
            industry: 'Manufacturing',
            companySize: 'Mid-Market',
            successRate: 0.76,
          },
        ],
        reasoningExplanation:
          'Based on customer profile and past success patterns in similar industry segments, executive engagement with technical briefing shows highest adoption rate.',
        applicabilityScore: 0.85,
        recommendedActions: [
          'Schedule C-level briefing within 2 weeks',
          'Prepare technical whitepaper addressing specific pain points',
          'Arrange follow-up demo after initial executive meeting',
        ],
      })),
    };

    // Test input data
    const testInput = {
      customerId: 'CUST-2024-00123',
      industry: 'Technology',
      companySize: 'Enterprise',
      dealValue: 500000,
      dealStage: 'Discovery',
      pastSuccessPatterns: ['PAT-2024-001', 'PAT-2024-002'],
      customerChallenges: ['Digital transformation', 'Legacy system modernization'],
    };

    // First execution
    const firstResult = generateDecisionGuidance(testInput, mockAIEngine);

    // Second execution with identical input
    const secondResult = generateDecisionGuidance(testInput, mockAIEngine);

    // Verify complete identity of results
    expect(firstResult.recommendedApproach).toBe(secondResult.recommendedApproach);
    expect(firstResult.recommendedApproach).toBe('Initial Contact with Executive Brief');

    expect(firstResult.confidenceScore).toBe(secondResult.confidenceScore);
    expect(firstResult.confidenceScore).toBe(0.87);

    expect(firstResult.reasoningExplanation).toBe(secondResult.reasoningExplanation);
    expect(firstResult.reasoningExplanation).toBe(
      'Based on customer profile and past success patterns in similar industry segments, executive engagement with technical briefing shows highest adoption rate.',
    );

    expect(firstResult.applicabilityScore).toBe(secondResult.applicabilityScore);
    expect(firstResult.applicabilityScore).toBe(0.85);

    // Verify similar patterns array identity
    expect(firstResult.similarPatterns).toEqual(secondResult.similarPatterns);
    expect(firstResult.similarPatterns).toEqual([
      {
        patternId: 'PAT-2024-001',
        matchScore: 0.92,
        industry: 'Technology',
        companySize: 'Enterprise',
        successRate: 0.89,
      },
      {
        patternId: 'PAT-2024-002',
        matchScore: 0.78,
        industry: 'Manufacturing',
        companySize: 'Mid-Market',
        successRate: 0.76,
      },
    ]);

    // Verify pattern rank order consistency
    expect(firstResult.similarPatterns[0].matchScore).toBe(0.92);
    expect(secondResult.similarPatterns[0].matchScore).toBe(0.92);
    expect(firstResult.similarPatterns[1].matchScore).toBe(0.78);
    expect(secondResult.similarPatterns[1].matchScore).toBe(0.78);

    // Verify recommended actions array identity
    expect(firstResult.recommendedActions).toEqual(secondResult.recommendedActions);
    expect(firstResult.recommendedActions).toEqual([
      'Schedule C-level briefing within 2 weeks',
      'Prepare technical whitepaper addressing specific pain points',
      'Arrange follow-up demo after initial executive meeting',
    ]);

    // Verify mock was called with identical input both times
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.generateRecommendation).toHaveBeenNthCalledWith(1, testInput);
    expect(mockAIEngine.generateRecommendation).toHaveBeenNthCalledWith(2, testInput);
  });
});