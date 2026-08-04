import { describe, test, expect } from '@jest/globals';
import { calculateDeviationFromStandardProcess } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と標準プロセスの乖離度算出', () => {
  // SCEN-2109
  test('成功パターンデータが空配列のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const proposalContent = {
      approach: 'consultative_approach',
      productRecommendations: ['product_A', 'product_B'],
      timeline: 30,
      targetBudget: 500000,
    };

    const standardProcessSteps = [
      { step: 1, name: 'initial_contact' },
      { step: 2, name: 'needs_analysis' },
      { step: 3, name: 'proposal_presentation' },
      { step: 4, name: 'negotiation' },
      { step: 5, name: 'closing' },
    ];

    const successPatterns: any[] = [];

    expect(() =>
      calculateDeviationFromStandardProcess(
        proposalContent,
        standardProcessSteps,
        successPatterns,
        mockAIRecommendationEngine
      )
    ).toThrow(/成功パターンデータが空/);
  });
});