import { validateLogicAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('ロジック精度検証 - 検証サンプルサイズ統計的有意性判定', () => {
  // SCEN-2745
  test('検証サンプルサイズが統計的に有意な数に満たないとき検証結果が無効と判定される', () => {
    const mockPatterns = [
      { patternId: 'P001', matchScore: 0.85, customerType: 'enterprise', industry: 'IT' },
      { patternId: 'P002', matchScore: 0.78, customerType: 'mid-market', industry: 'Finance' },
      { patternId: 'P003', matchScore: 0.92, customerType: 'enterprise', industry: 'Healthcare' },
      { patternId: 'P004', matchScore: 0.71, customerType: 'sme', industry: 'Retail' },
      { patternId: 'P005', matchScore: 0.88, customerType: 'enterprise', industry: 'Manufacturing' },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockPatterns),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const validationParams = {
      sampleSize: 5,
      confidenceThreshold: 0.95,
      patterns: mockPatterns,
    };

    const result = validateLogicAccuracy(validationParams, mockAIEngine);

    expect(result).toEqual({
      isValid: false,
      statusCode: 'INSUFFICIENT_SAMPLE_SIZE',
      message: '検証サンプルサイズが統計的に有意ではありません。最小必要数: 30、現在: 5',
      confidence: null,
      recommendationId: null,
    });
  });
});