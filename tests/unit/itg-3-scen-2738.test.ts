import { confirmRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 推奨履歴登録失敗時の処理', () => {
  // SCEN-2738
  test('推奨履歴テーブルへの登録に失敗したとき推奨内容の確定が失敗する', async () => {
    const recommendationId = 'rec_20240115_001';
    const customerId = 'cust_0987654321';
    const salesPersonId = 'sales_11223344';
    const recommendationContent = {
      proposalApproach: '顧客の経営課題に基づいた段階的提案アプローチ',
      recommendedTiming: '2024-02-15T10:00:00Z',
      confidenceScore: 87,
      successPatternId: 'pattern_success_001',
    };

    const mockRecommendationHistoryRepository = {
      save: jest.fn().mockRejectedValueOnce(new Error('INSERT failed with error code 500')),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValueOnce({
        recommendationId,
        customerId,
        proposalApproach: recommendationContent.proposalApproach,
        recommendedTiming: recommendationContent.recommendedTiming,
        confidenceScore: recommendationContent.confidenceScore,
        successPatternId: recommendationContent.successPatternId,
        reasoningBasis: [
          {
            dataSource: '過去事例',
            matchingFactor: '顧客業種と商品カテゴリの一致度95%',
            evidenceDetail: '類似案件3件で成約率88%を記録',
          },
          {
            dataSource: '成功パターン',
            matchingFactor: '提案タイミング（商談30日目）との合致',
            evidenceDetail: '同タイミング提案の成約率は82%',
          },
        ],
      }),
    };

    const input = {
      recommendationId,
      customerId,
      salesPersonId,
      recommendationContent,
      confirmationTimestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const result = await confirmRecommendation(
      input,
      mockRecommendationHistoryRepository,
      mockAIRecommendationEngine
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/推奨内容の保存に失敗/);
    expect(result.confirmationState).toBe(false);
    expect(mockRecommendationHistoryRepository.save).toHaveBeenCalledTimes(1);
    expect(result.recommendationHistoryId).toBeUndefined();
  });
});