import { findRecommendationReasons } from '../../src/logic/it-1-br-3-1-1-1';

const mockAIRecommendationEngine = {
  findSimilarPatterns: jest.fn(),
  generateRecommendation: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1901
  test('過去成功事例が0件のときに推奨根拠が空配列で返却される', async () => {
    const deal_condition_id = 'DC20240115001';
    const customer_id = 'CUST20240115001';
    const industry = 'IT';
    const company_size = 'small';

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValueOnce([]);

    const result = await findRecommendationReasons(
      {
        deal_condition_id,
        customer_id,
        industry,
        company_size,
      },
      mockAIRecommendationEngine
    );

    expect(result.recommendation_reasons).toEqual([]);
    expect(result.recommendation_reasons.length).toBe(0);
    expect(result.status_code).toBe(200);
    expect(result.error).toBeNull();
  });
});