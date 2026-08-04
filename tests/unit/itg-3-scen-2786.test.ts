import { describe, test, expect, beforeEach } from '@jest/globals';
import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Extraction and Weighting Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2786
  test('should throw error when challenge pattern is empty string', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const pastDealData = [
      {
        dealId: 'deal-001',
        customerIndustry: 'manufacturing',
        customerSize: 'large',
        challengePattern: 'cost_reduction',
        proposalApproach: 'automation_proposal',
        succeeded: true,
        weight: 0.8,
      },
      {
        dealId: 'deal-002',
        customerIndustry: 'retail',
        customerSize: 'medium',
        challengePattern: '',
        proposalApproach: 'digital_transformation',
        succeeded: false,
        weight: 0.0,
      },
    ];

    const newDealCondition = {
      customerIndustry: 'retail',
      customerSize: 'medium',
      challengePattern: 'operational_efficiency',
    };

    expect(() => {
      extractSuccessPatterns(
        pastDealData,
        newDealCondition,
        mockAIRecommendationEngine
      );
    }).toThrow(/課題パターン/);
  });
});