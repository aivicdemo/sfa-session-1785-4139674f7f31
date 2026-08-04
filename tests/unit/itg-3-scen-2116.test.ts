import { calculateDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-2116: 提案内容が標準スキーマに不適合のとき、SchemaValidationErrorがスローされる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        customerCondition: {
          industry: 'IT',
          companySize: 'large',
        },
        dealCondition: {
          dealStage: 'proposal',
          dealAmount: 5000000,
        },
        proposalApproach: undefined,
        businessRationale: undefined,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidProposalContent = {
      customerCondition: {
        industry: 'IT',
        companySize: 'large',
      },
      dealCondition: {
        dealStage: 'proposal',
        dealAmount: 5000000,
      },
    };

    const standardProcessSchema = {
      proposalApproach: { type: 'string', required: true },
      businessRationale: { type: 'string', required: true },
      customerCondition: { type: 'object', required: true },
      dealCondition: { type: 'object', required: true },
    };

    expect(() =>
      calculateDeviationScore(
        invalidProposalContent,
        standardProcessSchema,
        mockAIRecommendationEngine
      )
    ).toThrow(/proposalApproach|提案内容がスキーマに適合していません|Required field/);
  });
});