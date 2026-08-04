import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('商談条件マッチング機能 - パターン適合度スコア化', () => {
  test('SCEN-183: 予算・期間・関与部署が全て一致する場合にマッチスコアが最大値となる', () => {
    // Arrange: 新規案件データを準備
    const newDeal = {
      budget: 5000000, // 500万円
      duration_months: 6,
      involved_departments: ['営業部', '企画部'],
    };

    // 過去商談データベースの参照データ（成功事例）
    const historical_patterns = [
      {
        pattern_id: 'pattern_001',
        budget: 5000000, // 予算が完全一致
        duration_months: 6, // 期間が完全一致
        involved_departments: ['営業部', '企画部'], // 関与部署が完全一致
        success_count: 5,
        failure_count: 0,
      },
      {
        pattern_id: 'pattern_002',
        budget: 3000000, // 異なる予算
        duration_months: 3,
        involved_departments: ['営業部'],
        success_count: 3,
        failure_count: 1,
      },
    ];

    // AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((deal, patterns) => {
        // 予算・期間・関与部署が全て一致したパターンを検出
        const perfect_match = patterns.find(
          (p: any) =>
            p.budget === deal.budget &&
            p.duration_months === deal.duration_months &&
            JSON.stringify(p.involved_departments.sort()) ===
              JSON.stringify(deal.involved_departments.sort())
        );

        if (perfect_match) {
          // スコア計算ロジック: 3つの条件が全て一致 → 最大値（1.0）を返却
          return {
            pattern_id: perfect_match.pattern_id,
            relevance_score: 1.0,
            budget_match: true,
            duration_match: true,
            department_match: true,
            matching_conditions: 3,
            total_conditions: 3,
          };
        }

        return {
          relevance_score: 0.0,
          matching_conditions: 0,
          total_conditions: 3,
        };
      }),
    };

    // Act: 商談条件マッチング機能を実行
    const result = evaluatePatternRelevance(
      newDeal,
      historical_patterns,
      mockAIEngine
    );

    // Assert: マッチスコアが最大値（1.0）であることを確認
    expect(result.relevance_score).toBe(1.0);

    // 3つの条件が全て一致していることを確認
    expect(result.budget_match).toBe(true);
    expect(result.duration_match).toBe(true);
    expect(result.department_match).toBe(true);

    // マッチング条件カウントが満点（3/3）であることを確認
    expect(result.matching_conditions).toBe(3);
    expect(result.total_conditions).toBe(3);

    // AIEngineのevaluatePatternRelevanceが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDeal,
      historical_patterns
    );

    // 対応するパターンIDが返却されていることを確認
    expect(result.pattern_id).toBe('pattern_001');
  });
});