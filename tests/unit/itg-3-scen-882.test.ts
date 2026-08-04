import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-882: [edge] 推奨根拠データの提示機能 - 根拠データが0件のとき根拠なし表示が画面に表示される
  test('根拠データが0件の場合、根拠なしメッセージが表示される', () => {
    const new_case_customer_name = '新規顧客A社';
    const new_case_industry = '製造業';
    const new_case_company_size = 'large';
    const new_case_sales_stage = 'initial_contact';
    const new_case_customer_needs = ['コスト削減', '効率化'];

    const mock_recommendation_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_001',
        recommended_approach: '段階的導入提案',
        confidence_score: 0,
        rationale_data: [],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('根拠なし'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const input_params = {
      customer_name: new_case_customer_name,
      industry: new_case_industry,
      company_size: new_case_company_size,
      sales_stage: new_case_sales_stage,
      customer_needs: new_case_customer_needs,
      ai_engine: mock_recommendation_engine,
    };

    const result = generateRecommendation(input_params);

    expect(result).toBeDefined();
    expect(result.rationale_data).toEqual([]);
    expect(result.rationale_data.length).toBe(0);
    expect(result.explanation_message).toMatch(/根拠/);
    expect(mock_recommendation_engine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: new_case_customer_name,
        industry: new_case_industry,
        company_size: new_case_company_size,
        sales_stage: new_case_sales_stage,
        customer_needs: new_case_customer_needs,
      })
    );
    expect(result.is_rationale_empty).toBe(true);
  });
});