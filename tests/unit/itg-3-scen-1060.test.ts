import { generateRecommendationWithHistory } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1060: 推奨内容の根拠表示機能 - 推奨履歴テーブルに推奨内容と結果が同時に記録される', async () => {
    const customerId = 'CUST-001';
    const dealStage = '初期提案';
    const industryType = '製造業';
    const recommendationContent = '顧客A向け提案は問題解決型アプローチを推奨';
    const recommendationReasoning = '過去3年で同業種との成功率78%';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_content: recommendationContent,
        recommendation_reasoning: recommendationReasoning,
      }),
    };

    const result = await generateRecommendationWithHistory(
      {
        customer_id: customerId,
        deal_stage: dealStage,
        industry_type: industryType,
      },
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith({
      customer_id: customerId,
      deal_stage: dealStage,
      industry_type: industryType,
    });

    expect(result).toBeDefined();
    expect(result.recommendation_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(result.customer_id).toBe(customerId);
    expect(result.recommendation_content).toBe(recommendationContent);
    expect(result.recommendation_reasoning).toBe(recommendationReasoning);
    expect(result.status).toBe('active');

    const createdAtTime = new Date(result.created_at).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = Math.abs(currentTime - createdAtTime);
    expect(timeDiff).toBeLessThanOrEqual(5000);

    expect(result.record_count_in_history).toBe(1);
  });
});