import { generatePersuasionMaterialForExecutives } from '../../src/logic/it-1-br-3-3-2-1';

// Mock for AIRecommendationEngine
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe('Persuasion Material Generation for Executives - AI Fallback', () => {
  // SCEN-1978
  test('should generate simplified persuasion material from internal pattern master when AIRecommendationEngine fails', async () => {
    // Arrange: Setup mock to simulate AIRecommendationEngine failure
    mockAIRecommendationEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('API timeout after 30 seconds')
    );

    // Internal pattern master data (highest success rate pattern)
    const topSuccessPattern = {
      patternId: 'PAT-001',
      successRate: 87.5,
      customerIndustry: 'Manufacturing',
      companySizeRange: '1000-5000',
      challengeCategory: 'operational_efficiency',
      recommendedApproach: 'Process Automation Solution',
      keyPersuasionPoints: [
        'Reduce operational cost by 25-35%',
        'Improve process efficiency within 6 months',
        'Minimize implementation risk with phased rollout',
      ],
    };

    // Customer information
    const customerInfo = {
      industryName: 'Manufacturing',
      companySize: 2500,
      primaryChallenge: 'Operational efficiency improvement',
      currentState: 'Manual processes consuming 40% of labor hours',
      businessObjective: 'Reduce operational cost and improve competitiveness',
    };

    // Proposal content
    const proposalContent = {
      solutionName: 'Process Automation Suite',
      proposedBudget: 500000,
      implementationPeriod: 6,
      expectedROI: 3.2,
    };

    // Mock internal pattern master query
    const mockInternalPatternQuery = jest
      .fn()
      .mockResolvedValueOnce(topSuccessPattern);

    // Execute function with mock dependencies
    const result = await generatePersuasionMaterialForExecutives(
      customerInfo,
      proposalContent,
      mockAIRecommendationEngine,
      mockInternalPatternQuery
    );

    // Assert: Verify AIRecommendationEngine was called first
    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalledTimes(1);
    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalledWith({
      customerIndustry: customerInfo.industryName,
      companySize: customerInfo.companySize,
      primaryChallenge: customerInfo.primaryChallenge,
      proposalContent: proposalContent,
    });

    // Assert: Verify internal pattern master was queried after failure
    expect(mockInternalPatternQuery).toHaveBeenCalledTimes(1);
    expect(mockInternalPatternQuery).toHaveBeenCalledWith({
      industryFilter: customerInfo.industryName,
      companySizeFilter: customerInfo.companySize,
      challengeFilter: customerInfo.primaryChallenge,
      orderBy: 'successRate',
      limit: 1,
    });

    // Assert: Verify result contains required elements
    expect(result).toHaveProperty('material');
    expect(result.material).toHaveProperty('executiveSummary');
    expect(result.material).toHaveProperty('challengeProposalMapping');
    expect(result.material).toHaveProperty('simplifiedReasoning');
    expect(result.material).toHaveProperty('persuasionPoints');

    // Assert: Challenge-proposal mapping is present
    expect(result.material.challengeProposalMapping).toEqual({
      customerChallenge: customerInfo.primaryChallenge,
      proposedSolution: topSuccessPattern.recommendedApproach,
    });

    // Assert: Reasoning is marked as simplified (fallback) version
    expect(result.material.simplifiedReasoning).toBeDefined();
    expect(result.material.reasoningType).toBe('simplified');
    expect(result.material.reasoningType).not.toBe('full_ai_generated');

    // Assert: Persuasion points are derived from success pattern
    expect(result.material.persuasionPoints).toEqual(
      topSuccessPattern.keyPersuasionPoints
    );

    // Assert: Success rate metadata is included
    expect(result.material.successRateReference).toBe(87.5);

    // Assert: User message indicates delay and fallback
    expect(result.userMessage).toMatch(/一時的な遅延が発生しています/);
    expect(result.userMessage).toMatch(/過去の推奨履歴から類似案件を表示/);

    // Assert: Flag indicates fallback material (not full AI version)
    expect(result.isFallbackMaterial).toBe(true);

    // Assert: Pattern source is documented
    expect(result.sourcePatternId).toBe('PAT-001');
  });
});