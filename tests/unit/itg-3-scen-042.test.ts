import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容生成機能 - OpenAI API連携', () => {
  test('SCEN-042: OpenAI API呼び出しが成功した場合に生成された推奨内容が返される', async () => {
    // Arrange: モック化されたAIRecommendationEngineを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20260801-001',
        proposalApproach: '顧客の課題解決型提案アプローチ',
        successRationale: '過去3件の類似案件で80%の成約率',
        suggestedNextSteps: ['初回ヒアリング日程調整', 'ROI試算シート準備']
      })
    };

    const testDealData = {
      customerId: 'CUST-12345',
      industryType: '製造業',
      dealAmount: 5000000,
      previousSuccessPatternsCount: 15
    };

    // Act: 推奨内容生成機能を実行
    const result = await generateRecommendation(testDealData, mockAIEngine);

    // Assert: 返却された推奨内容がモックレスポンスと完全一致
    expect(result).toEqual({
      recommendationId: 'REC-20260801-001',
      proposalApproach: '顧客の課題解決型提案アプローチ',
      successRationale: '過去3件の類似案件で80%の成約率',
      suggestedNextSteps: ['初回ヒアリング日程調整', 'ROI試算シート準備'],
      status: '生成完了'
    });

    // Assert: AIエンジンが正しい入力で呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(testDealData);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});