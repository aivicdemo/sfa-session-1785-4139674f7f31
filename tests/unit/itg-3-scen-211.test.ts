import { recommendSalesApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-211: 同じ新規案件条件で2回推奨実行したとき、同じ推奨結果が返却される', () => {
    // Arrange: テスト用の新規案件条件データ
    const newDealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakers: 3,
      desiredImplementationPeriod: '3ヶ月以内',
    };

    // Arrange: AIRecommendationEngineのスタブを構成
    const recommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'REC-2025-001',
        proposalStrategy: '経営層向け価値訴求',
        confidenceScore: 0.87,
        evidencePatternCount: 4,
        evidenceExplanation: '過去の同規模製造業案件から抽出した成功パターン',
      }),
    };

    // Act: 1回目の推奨実行
    const firstRecommendationResult = recommendSalesApproach(
      newDealCondition,
      recommendationEngineStub
    );

    // Assert: 1回目の結果を検証
    expect(firstRecommendationResult).toEqual({
      recommendationId: 'REC-2025-001',
      proposalStrategy: '経営層向け価値訴求',
      confidenceScore: 0.87,
      evidencePatternCount: 4,
      evidenceExplanation: '過去の同規模製造業案件から抽出した成功パターン',
    });

    // Act: 2回目の推奨実行（同じ条件で）
    const secondRecommendationResult = recommendSalesApproach(
      newDealCondition,
      recommendationEngineStub
    );

    // Assert: 2回目の結果を検証
    expect(secondRecommendationResult).toEqual({
      recommendationId: 'REC-2025-001',
      proposalStrategy: '経営層向け価値訴求',
      confidenceScore: 0.87,
      evidencePatternCount: 4,
      evidenceExplanation: '過去の同規模製造業案件から抽出した成功パターン',
    });

    // Assert: 1回目と2回目の推奨内容が完全に一致することを確認
    expect(firstRecommendationResult.recommendationId).toBe(
      secondRecommendationResult.recommendationId
    );
    expect(firstRecommendationResult.proposalStrategy).toBe(
      secondRecommendationResult.proposalStrategy
    );
    expect(firstRecommendationResult.confidenceScore).toBe(
      secondRecommendationResult.confidenceScore
    );
    expect(firstRecommendationResult.evidencePatternCount).toBe(
      secondRecommendationResult.evidencePatternCount
    );
    expect(firstRecommendationResult.evidenceExplanation).toBe(
      secondRecommendationResult.evidenceExplanation
    );

    // Assert: AIRecommendationEngineのスタブが正確に2回呼び出されたことを検証
    expect(recommendationEngineStub.generateRecommendation).toHaveBeenCalledTimes(
      2
    );
    expect(recommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});