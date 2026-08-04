import { extractImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-533: [edge] 改善対象項目抽出機能 - 抽出対象となる改善項目が0件のとき空配列が返される
  test('should return empty array when no improvement items match the current deal conditions', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
    };

    const dealConditions = {
      customer_id: 'CUST-12345',
      industry: 'IT',
      company_size: 'large',
      budget: 5000000,
      timeline_days: 90,
      current_challenge: 'digital_transformation',
      proposal_approach: 'cloud_migration',
    };

    const successPatternMaster = [
      {
        pattern_id: 'PAT-001',
        industry: 'finance',
        company_size: 'medium',
        relevance_score: 0,
      },
      {
        pattern_id: 'PAT-002',
        industry: 'manufacturing',
        company_size: 'small',
        relevance_score: 0,
      },
    ];

    const result = extractImprovementItems(
      dealConditions,
      successPatternMaster,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});