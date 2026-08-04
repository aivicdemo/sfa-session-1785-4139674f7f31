import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2607
  test('推奨根拠の可視化機能 - 推奨パターンの根拠として参照される過去商談件数が0件の場合、推奨の信頼度が適切に表示される', async () => {
    // Arrange: AIRecommendationEngine のスタブ設定
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(async () => ({
        patterns: [],
        totalCount: 0,
        matchScores: [],
      })),
      generateRecommendation: jest.fn(async (params: {
        customerSize: string;
        industry: string;
        budget: number;
        proposalApproach: string;
      }) => ({
        recommendationId: 'rec-001',
        proposalContent: 'テスト提案内容',
        recommendedAction: 'フォローアップを実施',
        trustScore: 0.15,
        referencedPatternCount: 0,
        rationale: {
          basis: 'Limited historical data',
          confidenceLevel: 'Low',
          warningMessage: '限定的な過去実績に基づく推奨のため、営業判断での検証をお勧めします',
        },
      })),
      explainRecommendationReasoning: jest.fn(async () => ({
        explanation: 'Limited historical reference',
        details: [],
      })),
      evaluatePatternRelevance: jest.fn(async () => ({
        relevanceScore: 0.15,
        applicability: 'Low',
      })),
    };

    // 新規案件の顧客・商談条件を準備
    const newDealInput = {
      customerSize: 'medium',
      industry: 'technology',
      budget: 5000000,
      proposalApproach: 'digital_transformation',
    };

    // Act: generateRecommendation メソッドを呼び出し
    const recommendationResult = await generateRecommendationWithReasoning(
      newDealInput,
      mockAIRecommendationEngine
    );

    // Assert: 推奨根拠の可視化機能の検証
    // (1) 信頼度スコアが0.0～0.3の範囲内の低値であることを確認
    expect(recommendationResult.trustScore).toBeGreaterThanOrEqual(0.0);
    expect(recommendationResult.trustScore).toBeLessThanOrEqual(0.3);
    expect(recommendationResult.trustScore).toBe(0.15);

    // (2) 信頼度インジケータが『低い』と示されることを確認
    expect(recommendationResult.rationale.confidenceLevel).toBe('Low');

    // (3) 『参照商談件数: 0件』と明確に表記されることを確認
    expect(recommendationResult.referencedPatternCount).toBe(0);

    // (4) 『限定的な過去実績に基づく推奨のため、営業判断での検証をお勧めします』等の注釈メッセージが表示されることを確認
    expect(recommendationResult.rationale.warningMessage).toMatch(
      /限定的な過去実績に基づく推奨のため、営業判断での検証をお勧めします/
    );

    // 推奨内容が生成されていることを確認
    expect(recommendationResult.recommendationId).toBe('rec-001');
    expect(recommendationResult.proposalContent).toBe('テスト提案内容');
    expect(recommendationResult.recommendedAction).toBe('フォローアップを実施');

    // AIRecommendationEngine のメソッドが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealInput
    );
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});