import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('generateRecommendation with OpenAI API timeout fallback', () => {
  // SCEN-2914
  test('should return top success pattern from master when generateRecommendation times out within 30 seconds', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(() => 
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API request timeout exceeded 30s'));
          }, 100);
        })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const patternMaster = [
      {
        patternId: 'PAT-001',
        successRate: 85,
        pastContractCount: 120,
      },
      {
        patternId: 'PAT-002',
        successRate: 78,
        pastContractCount: 95,
      },
      {
        patternId: 'PAT-003',
        successRate: 72,
        pastContractCount: 80,
      },
    ];

    const newCaseInput = {
      customerIndustry: '製造業',
      caseAmount: 5000000,
      decisionMakerCount: 3,
    };

    const result = await generateRecommendation(
      newCaseInput,
      mockAIEngine,
      patternMaster
    );

    expect(result.recommendedPatternId).toBe('PAT-001');
    expect(result.pastContractCount).toBe(120);
    expect(result.reasoningExplanation).toBe(
      '過去同条件での成功実績が豊富なパターンです'
    );
    expect(result.isSimplifiedExplanation).toBe(true);
  });
});