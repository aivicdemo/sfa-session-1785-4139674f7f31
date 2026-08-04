import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  test('SCEN-1815: [normal] 抽出成功パターンが新規案件に適用可能なスコアとして評価される', () => {
    // Arrange: 新規案件データ
    const newDealData = {
      industry: 'IT',
      product: 'クラウドソリューション',
      estimatedContractAmount: 8000000,
      companySize: '中堅企業',
    };

    // Mock AIRecommendationEngine.evaluatePatternRelevance
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.87,
        matchedPatternCount: 2,
        applicabilityReason: '業界・商材・契約金額帯が一致',
      }),
    };

    // Act: 成功パターン適用可能性評価機能を実行
    const evaluationResult = evaluatePatternRelevance(
      newDealData,
      mockAIEngine
    );

    // Assert
    // 1. モック呼び出しが正確に1回実行されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    // 2. relevanceScoreが0.87（0.0～1.0の範囲内、小数第2位まで）であることを確認
    expect(evaluationResult.relevanceScore).toBe(0.87);

    // 3. matchedPatternCountが2（過去の成功パターンから2件がマッチ）であることを確認
    expect(evaluationResult.matchedPatternCount).toBe(2);

    // 4. applicabilityReasonが具体的な根拠テキストを含むことを確認
    expect(evaluationResult.applicabilityReason).toBe('業界・商材・契約金額帯が一致');

    // 5. 評価結果ステータスが'APPLICABLE'と判定されていることを確認
    expect(evaluationResult.status).toBe('APPLICABLE');

    // 6. 返却データ構造の整合性確認
    expect(evaluationResult).toEqual({
      relevanceScore: 0.87,
      matchedPatternCount: 2,
      applicabilityReason: '業界・商材・契約金額帯が一致',
      status: 'APPLICABLE',
    });
  });
});