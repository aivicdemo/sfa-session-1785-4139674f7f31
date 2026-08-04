import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンランク付け機能', () => {
  // SCEN-2354
  test('適用可能な成功パターンが複数件のとき類似度スコア順に正しくランク付けされる', () => {
    const patternA = {
      patternId: 'pattern_001',
      industry: 'IT企業',
      budget: '500万円以上',
      decisionMaker: 'CTO',
      successRate: 0.85,
      appliedCount: 12
    };

    const patternB = {
      patternId: 'pattern_002',
      industry: 'IT企業',
      budget: '300万円以上500万円未満',
      decisionMaker: 'IT部長',
      successRate: 0.72,
      appliedCount: 8
    };

    const patternC = {
      patternId: 'pattern_003',
      industry: 'IT企業',
      budget: '1000万円以上',
      decisionMaker: 'CEO',
      successRate: 0.68,
      appliedCount: 5
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { pattern: patternA, similarityScore: 0.92 },
        { pattern: patternB, similarityScore: 0.78 },
        { pattern: patternC, similarityScore: 0.65 }
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const newDealCondition = {
      industry: 'IT企業',
      budget: '500万円以上',
      decisionMaker: 'CTO',
      dealAmount: 5000000,
      salesStage: 'proposal',
      customerSize: 'enterprise'
    };

    const result = findSimilarPatterns(newDealCondition, mockAIEngine);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    
    expect(result[0].patternId).toBe('pattern_001');
    expect(result[0].similarityScore).toBe(0.92);
    
    expect(result[1].patternId).toBe('pattern_002');
    expect(result[1].similarityScore).toBe(0.78);
    
    expect(result[2].patternId).toBe('pattern_003');
    expect(result[2].similarityScore).toBe(0.65);

    expect(result[0].similarityScore).toBeGreaterThan(result[1].similarityScore);
    expect(result[1].similarityScore).toBeGreaterThan(result[2].similarityScore);
  });
});