import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2367
  test('推論精度スコアがちょうど100の場合、正確に100として算出される', () => {
    const mockEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.0),
    };

    const input = {
      engine: mockEngine,
      recommendationData: {
        customerId: 'C001',
        dealConditions: {
          industry: 'IT',
          companySize: 'large',
          budget: 5000000,
        },
        proposalContent: {
          approach: 'digital_transformation',
          timeline: 12,
        },
      },
    };

    const result = evaluateInferenceAccuracy(input);

    expect(typeof result).toBe('number');
    expect(result).toBe(100);
    expect(mockEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});