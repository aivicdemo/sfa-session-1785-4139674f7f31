import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨生成機能 - 再試行失敗時のエラーハンドリング', () => {
  test('SCEN-2642: 3回の再試行すべてが失敗したときエラーが発生する', async () => {
    // Arrange: AIRecommendationEngineのモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Timeout after 1000ms'))
        .mockRejectedValueOnce(new Error('Timeout after 2000ms'))
        .mockRejectedValueOnce(new Error('Timeout after 4000ms')),
    };

    // 入力データ: 有効な顧客情報と商談条件
    const customerInfo = {
      customer_id: 'CUST-2024-001',
      company_name: '山田電子工業',
      industry: 'manufacturing',
      company_size: 'large',
      annual_revenue: 5000000000,
      contact_person: '営業太郎',
    };

    const dealCondition = {
      deal_id: 'DEAL-2024-0001',
      product_category: 'IoT_solution',
      estimated_budget: 50000000,
      decision_timeline_days: 60,
      current_stage: 'requirement_gathering',
      competitor_info: 'active_competition',
    };

    // Act & Assert: 推奨生成処理を実行し、3回の再試行後にエラーがスローされることを検証
    await expect(
      generateRecommendation(customerInfo, dealCondition, mockAIEngine)
    ).rejects.toThrow(/AIエンジンからの推奨生成に失敗しました|Recommendation engine unavailable after 3 retries/);

    // Assert: AIエンジンが3回呼び出されたことを検証
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});