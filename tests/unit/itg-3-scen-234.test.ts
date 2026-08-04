import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-234
  test('推奨根拠の適用可能性スコアが null のとき、可視化処理がエラーになる', async () => {
    const mockRecommendationReasoning = {
      recommendationId: 'REC-001',
      dealId: 'DEAL-12345',
      customerId: 'CUST-789',
      proposedApproach: '顧客の業種に適合した提案アプローチ',
      applicabilityScore: null,
      supportingEvidence: [
        {
          type: 'past_success_case',
          reference: 'CASE-2024-001',
          similarity: 0.92,
        },
      ],
      reasoningExplanation: '過去の類似案件との比較により推奨',
      generatedAt: new Date('2024-01-15T10:30:00Z'),
    };

    await expect(
      visualizeRecommendationReasoning(mockRecommendationReasoning)
    ).rejects.toThrow(/適用可能性スコア/);
  });
});