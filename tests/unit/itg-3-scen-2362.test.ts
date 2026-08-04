import { recordRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2362: [edge] 推奨根拠記録機能 - 推奨根拠に0件のデータが格納されているとき新規記録が追加できる
  test('推奨根拠が0件の状態で新規推奨根拠レコードが正常に1件追加される', async () => {
    const dealId = 'DEAL-00001';
    const recommendationId = 'REC-AUTO-00001';
    const recommendedApproach = '顧客ニーズに基づいた段階的提案アプローチ';
    const reasoningBasis = '過去の類似案件（成約率85%）から抽出した成功パターンに基づいています。顧客業種は製造業で、規模は中堅企業。提案タイミングは四半期決算前が最適です。';
    const confidenceScore = 87;
    const generatedAt = new Date('2024-12-15T14:30:00Z');

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach,
        reasoningBasis,
        confidenceScore,
        relatedSuccessPatterns: [
          { patternId: 'SP-001', matchScore: 0.92 },
          { patternId: 'SP-002', matchScore: 0.85 },
        ],
      }),
    };

    const mockRecommendationReasonRepository = {
      countByDealId: jest.fn().mockResolvedValue(0),
      save: jest.fn().mockResolvedValue({
        id: 'RRD-AUTO-00001',
        dealId,
        recommendationId,
        recommendedApproach,
        reasoningBasis,
        confidenceScore,
        recordedAt: generatedAt,
      }),
      findByDealId: jest.fn().mockResolvedValue([
        {
          id: 'RRD-AUTO-00001',
          dealId,
          recommendationId,
          recommendedApproach,
          reasoningBasis,
          confidenceScore,
          recordedAt: generatedAt,
        },
      ]),
    };

    const result = await recordRecommendationReasoning(
      {
        dealId,
        recommendationId,
        recommendedApproach,
        reasoningBasis,
        confidenceScore,
      },
      mockAIRecommendationEngine,
      mockRecommendationReasonRepository
    );

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/推奨根拠を記録しました/);
    expect(result.recordedRecommendationReason.id).toBe('RRD-AUTO-00001');
    expect(result.recordedRecommendationReason.dealId).toBe(dealId);
    expect(result.recordedRecommendationReason.recommendedApproach).toBe(recommendedApproach);
    expect(result.recordedRecommendationReason.reasoningBasis).toBe(reasoningBasis);
    expect(result.recordedRecommendationReason.confidenceScore).toBe(confidenceScore);
    expect(result.totalCount).toBe(1);
    expect(mockRecommendationReasonRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRecommendationReasonRepository.countByDealId).toHaveBeenCalledWith(dealId);
  });
});