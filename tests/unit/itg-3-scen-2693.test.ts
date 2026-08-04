import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2693
  test('AIRecommendationEngine.explainRecommendationReasoningが正常応答したとき、自然言語説明が根拠として営業担当者向けに出力される', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'この顧客はIT導入予算が年度末に集中する傾向があり、同業種の過去3件の成功事例では9月中旬の提案が最も受注率が高かった（成功率83%）。現在の時期と顧客の業種・予算規模が過去事例と合致しているため、今月中の初回提案を推奨します。',
        confidenceScore: 85,
        keyFactors: [
          '顧客の購買行動パターン: IT導入予算が年度末に集中',
          '過去成功事例: 3件',
          '過去成功率: 83%',
          '合致点: 時期と顧客の業種・予算規模が合致',
          'アクション推奨: 今月中の初回提案を推奨'
        ]
      })
    };

    const input = {
      dealId: 'DEAL-001',
      customerId: 'CUST-789',
      customerIndustry: 'IT',
      budgetScale: 'large',
      currentDate: new Date('2024-09-10T09:00:00Z'),
      proposalApproach: 'initial_proposal_mid_september'
    };

    const result = await explainRecommendationReasoning(
      input,
      mockAIRecommendationEngine
    );

    expect(result.explanation).toContain('IT導入予算が年度末に集中');
    expect(result.explanation).toContain('過去3件');
    expect(result.explanation).toContain('成功率83%');
    expect(result.explanation).toContain('時期と顧客の業種・予算規模が合致');
    expect(result.explanation).toContain('今月中の初回提案を推奨');
    expect(result.confidenceScore).toBe(85);
    expect(result.isReadableForSalesPerson).toBe(true);

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-001',
        customerId: 'CUST-789',
        customerIndustry: 'IT'
      })
    );
  });
});