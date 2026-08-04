import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-146
  test('推奨根拠情報が入力順で正しく維持される', () => {
    const mockRecommendationBasisData = {
      recommendationId: 'rec-2024-001',
      basis: [
        {
          type: 'past_success_match',
          score: 0.92,
          label: '過去成功事例マッチスコア0.92',
          description: '過去の類似案件から抽出した成功パターンとの一致度'
        },
        {
          type: 'customer_industry_fit',
          score: 0.88,
          label: '顧客業種適合性スコア0.88',
          description: '提案内容が顧客業種の特性に適合する程度'
        },
        {
          type: 'proposal_approach_rate',
          score: 0.85,
          label: '提案アプローチ適用率スコア0.85',
          description: '推奨提案アプローチが実際に適用された実績'
        }
      ],
      timestamp: '2024-01-15T11:00:00Z'
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: mockRecommendationBasisData.recommendationId,
        basisList: mockRecommendationBasisData.basis,
        generatedAt: mockRecommendationBasisData.timestamp
      })
    };

    const result = visualizeRecommendationBasis(
      mockRecommendationBasisData,
      mockAIRecommendationEngine
    );

    expect(result.basisElements).toHaveLength(3);

    expect(result.basisElements[0]).toMatchObject({
      index: 0,
      type: 'past_success_match',
      score: 0.92,
      label: '過去成功事例マッチスコア0.92',
      positionInSet: '1'
    });

    expect(result.basisElements[1]).toMatchObject({
      index: 1,
      type: 'customer_industry_fit',
      score: 0.88,
      label: '顧客業種適合性スコア0.88',
      positionInSet: '2'
    });

    expect(result.basisElements[2]).toMatchObject({
      index: 2,
      type: 'proposal_approach_rate',
      score: 0.85,
      label: '提案アプローチ適用率スコア0.85',
      positionInSet: '3'
    });

    expect(result.basisElements.map((e) => e.label)).toEqual([
      '過去成功事例マッチスコア0.92',
      '顧客業種適合性スコア0.88',
      '提案アプローチ適用率スコア0.85'
    ]);

    expect(result.displayOrder).toEqual([0, 1, 2]);
    expect(result.isOrderPreserved).toBe(true);
  });
});