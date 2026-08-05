import { calculateDivergencePriorityRanking } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-256: 乖離パターン判定機能 - 複数営業担当者の乖離パターンが同値のとき優先度判定が一貫性を保つ', () => {
    const sales_rep_a_id = 'A001';
    const sales_rep_b_id = 'B002';
    const sales_rep_c_id = 'C003';
    const equal_divergence_score = 8.5;

    const input_data = [
      {
        sales_rep_id: sales_rep_a_id,
        divergence_score: equal_divergence_score,
      },
      {
        sales_rep_id: sales_rep_b_id,
        divergence_score: equal_divergence_score,
      },
      {
        sales_rep_id: sales_rep_c_id,
        divergence_score: equal_divergence_score,
      },
    ];

    const result_run_1 = calculateDivergencePriorityRanking(input_data);
    const result_run_2 = calculateDivergencePriorityRanking(input_data);
    const result_run_3 = calculateDivergencePriorityRanking(input_data);

    const ranking_map_1 = new Map(
      result_run_1.map((item) => [item.sales_rep_id, item.priority_rank])
    );
    const ranking_map_2 = new Map(
      result_run_2.map((item) => [item.sales_rep_id, item.priority_rank])
    );
    const ranking_map_3 = new Map(
      result_run_3.map((item) => [item.sales_rep_id, item.priority_rank])
    );

    expect(ranking_map_1.get(sales_rep_a_id)).toBe(
      ranking_map_2.get(sales_rep_a_id)
    );
    expect(ranking_map_1.get(sales_rep_a_id)).toBe(
      ranking_map_3.get(sales_rep_a_id)
    );

    expect(ranking_map_1.get(sales_rep_b_id)).toBe(
      ranking_map_2.get(sales_rep_b_id)
    );
    expect(ranking_map_1.get(sales_rep_b_id)).toBe(
      ranking_map_3.get(sales_rep_b_id)
    );

    expect(ranking_map_1.get(sales_rep_c_id)).toBe(
      ranking_map_2.get(sales_rep_c_id)
    );
    expect(ranking_map_1.get(sales_rep_c_id)).toBe(
      ranking_map_3.get(sales_rep_c_id)
    );

    const rank_set_run_1 = new Set(ranking_map_1.values());
    const rank_set_run_2 = new Set(ranking_map_2.values());
    const rank_set_run_3 = new Set(ranking_map_3.values());

    expect(rank_set_run_1.size).toBeGreaterThanOrEqual(1);
    expect(rank_set_run_2.size).toBeGreaterThanOrEqual(1);
    expect(rank_set_run_3.size).toBeGreaterThanOrEqual(1);
  });
});