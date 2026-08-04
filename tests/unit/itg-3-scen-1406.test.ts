import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1406: 経営目標とスケジュール制約が同値で並ぶとき、すべてが照合対象に含まれる', () => {
    // テストデータ設定
    const managementGoals = [
      { id: 'goal_A', name: '目標A', priority_score: 5.0, importance_score: 5.0 },
      { id: 'goal_B', name: '目標B', priority_score: 5.0, importance_score: 5.0 },
      { id: 'goal_C', name: '目標C', priority_score: 5.0, importance_score: 5.0 }
    ];

    const scheduleConstraints = [
      { id: 'constraint_1', name: '制約1', priority_score: 5.0, importance_score: 5.0 },
      { id: 'constraint_2', name: '制約2', priority_score: 5.0, importance_score: 5.0 },
      { id: 'constraint_3', name: '制約3', priority_score: 5.0, importance_score: 5.0 }
    ];

    const proposalContents = [
      { id: 'proposal_X', name: '提案X', alignment_score: 5.0 },
      { id: 'proposal_Y', name: '提案Y', alignment_score: 5.0 },
      { id: 'proposal_Z', name: '提案Z', alignment_score: 5.0 }
    ];

    // AIRecommendationEngineのスタブ設定
    const ai_engine_stub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        { pattern_id: 'pattern_1', success_rate: 0.85, matched_goals: ['goal_A', 'goal_B', 'goal_C'], matched_constraints: ['constraint_1', 'constraint_2', 'constraint_3'] }
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 自動照合機能の実行
    const alignment_result = evaluateProposalConstraintAlignment(
      {
        management_goals: managementGoals,
        schedule_constraints: scheduleConstraints,
        proposal_contents: proposalContents
      },
      ai_engine_stub
    );

    // 照合結果の検証
    // 期待値: 経営目標3件 + スケジュール制約3件 = 計6件がすべて照合対象に含まれる
    const included_items = alignment_result.alignment_records.filter(
      (record: { alignment_flag: boolean }) => record.alignment_flag === true
    );

    expect(included_items.length).toBe(6);

    // 各項目の照合スコアが5.0以上であることを検証
    const all_scores_valid = alignment_result.alignment_records.every(
      (record: { alignment_score: number }) => record.alignment_score >= 5.0
    );
    expect(all_scores_valid).toBe(true);

    // 除外または部分照合として判定された項目が0件であることを検証
    const excluded_or_partial_items = alignment_result.alignment_records.filter(
      (record: { alignment_flag: boolean }) => record.alignment_flag === false
    );
    expect(excluded_or_partial_items.length).toBe(0);

    // 照合結果の詳細ログで各項目のステータスを記録・検証
    expect(alignment_result.alignment_records).toHaveLength(6);
    alignment_result.alignment_records.forEach(
      (record: { alignment_status: string; alignment_score: number }) => {
        expect(record.alignment_status).toBe('照合対象に含まれた');
        expect(record.alignment_score).toBeGreaterThanOrEqual(5.0);
      }
    );

    // 照合処理の完全性を検証
    expect(alignment_result.total_alignment_count).toBe(6);
    expect(alignment_result.excluded_count).toBe(0);
    expect(alignment_result.partial_match_count).toBe(0);
  });
});