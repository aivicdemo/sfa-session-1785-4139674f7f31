import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去商談データから複数成功パターンの照合と推奨生成', () => {
  test('SCEN-925: 複数の成功パターンがすべて照合され、ランク付けされた提案アプローチが返却される', () => {
    // ==================== Setup ====================
    // AIRecommendationEngineのスタブを定義
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_A',
          description: '大企業向け提案、長期契約',
          similarityScore: 0.92,
          pastDealCount: 15,
        },
        {
          patternId: 'pattern_B',
          description: '中小企業向け提案、短期試用',
          similarityScore: 0.85,
          pastDealCount: 8,
        },
        {
          patternId: 'pattern_C',
          description: '特定業界向け提案、バンドル商品',
          similarityScore: 0.78,
          pastDealCount: 3,
        },
      ]),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ patternId: 'pattern_A', relevanceScore: 0.95 })
        .mockResolvedValueOnce({ patternId: 'pattern_B', relevanceScore: 0.88 })
        .mockResolvedValueOnce({ patternId: 'pattern_C', relevanceScore: 0.80 }),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            rank: 1,
            patternId: 'pattern_A',
            compositeScore: 0.874,
            proposalApproach: '大企業向け長期契約型アプローチ',
            rationale: '過去同規模顧客との成約率92%',
            similarityScore: 0.92,
            relevanceScore: 0.95,
          },
          {
            rank: 2,
            patternId: 'pattern_B',
            compositeScore: 0.748,
            proposalApproach: '段階的導入による段階契約型アプローチ',
            rationale: '新規顧客導入リスク軽減実績あり',
            similarityScore: 0.85,
            relevanceScore: 0.88,
          },
          {
            rank: 3,
            patternId: 'pattern_C',
            compositeScore: 0.624,
            proposalApproach: '業界別カスタマイズバンドル提案',
            rationale: '同業界での導入事例3件',
            similarityScore: 0.78,
            relevanceScore: 0.80,
          },
        ],
        metadata: {
          matchedAt: '2024-02-15T14:30:00Z',
          totalPatternsMatched: 3,
          patternsExcluded: 0,
        },
      }),
    };

    // 新規案件の入力パラメータ
    const newDealInput = {
      customerSize: 'large_enterprise',
      industry: 'manufacturing',
      budgetScale: 'high',
      decisionTimeframe: 'medium_3_to_6_months',
    };

    // ==================== Act ====================
    const result = generateRecommendation(newDealInput, mockAIEngine);

    // ==================== Assert ====================
    // 戻り値が Promise を返す場合
    return result.then((output: any) => {
      // 推奨アプローチリストが3件返却されることを確認
      expect(output.recommendations).toHaveLength(3);

      // ランク1位の検証
      expect(output.recommendations[0]).toEqual({
        rank: 1,
        patternId: 'pattern_A',
        compositeScore: 0.874,
        proposalApproach: '大企業向け長期契約型アプローチ',
        rationale: '過去同規模顧客との成約率92%',
        similarityScore: 0.92,
        relevanceScore: 0.95,
      });

      // ランク2位の検証
      expect(output.recommendations[1]).toEqual({
        rank: 2,
        patternId: 'pattern_B',
        compositeScore: 0.748,
        proposalApproach: '段階的導入による段階契約型アプローチ',
        rationale: '新規顧客導入リスク軽減実績あり',
        similarityScore: 0.85,
        relevanceScore: 0.88,
      });

      // ランク3位の検証
      expect(output.recommendations[2]).toEqual({
        rank: 3,
        patternId: 'pattern_C',
        compositeScore: 0.624,
        proposalApproach: '業界別カスタマイズバンドル提案',
        rationale: '同業界での導入事例3件',
        similarityScore: 0.78,
        relevanceScore: 0.80,
      });

      // メタデータの検証
      expect(output.metadata).toEqual({
        matchedAt: '2024-02-15T14:30:00Z',
        totalPatternsMatched: 3,
        patternsExcluded: 0,
      });

      // 複合スコアの計算式検証（類似度 × 適用可能性スコア）
      expect(output.recommendations[0].compositeScore).toBe(0.92 * 0.95); // 0.874
      expect(output.recommendations[1].compositeScore).toBe(0.85 * 0.88); // 0.748
      expect(output.recommendations[2].compositeScore).toBe(0.78 * 0.80); // 0.624

      // スコア降順でランク付けされていることを確認
      expect(output.recommendations[0].compositeScore).toBeGreaterThan(
        output.recommendations[1].compositeScore
      );
      expect(output.recommendations[1].compositeScore).toBeGreaterThan(
        output.recommendations[2].compositeScore
      );

      // AIエンジンのスタブが呼び出されたことを確認
      expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);
      expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
      expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
        newDealInput,
        expect.any(Array)
      );
    });
  });
});