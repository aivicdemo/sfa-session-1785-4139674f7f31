import { calculateComplianceCompletionMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('営業周知完了判定の集計結果一貫性', () => {
  // SCEN-1014
  test('同じ入力データで2回実行した場合、理解度スコア集計と実務適用状況集計の結果が同一である', () => {
    // テストデータの準備
    const test_data = [
      {
        sales_person_id: 'SP001',
        comprehension_score: 75,
        applied: true,
      },
      {
        sales_person_id: 'SP002',
        comprehension_score: 100,
        applied: true,
      },
      {
        sales_person_id: 'SP003',
        comprehension_score: 60,
        applied: true,
      },
      {
        sales_person_id: 'SP004',
        comprehension_score: 80,
        applied: true,
      },
      {
        sales_person_id: 'SP005',
        comprehension_score: 70,
        applied: true,
      },
      {
        sales_person_id: 'SP006',
        comprehension_score: 75,
        applied: true,
      },
      {
        sales_person_id: 'SP007',
        comprehension_score: 85,
        applied: true,
      },
      {
        sales_person_id: 'SP008',
        comprehension_score: 75,
        applied: true,
      },
      {
        sales_person_id: 'SP009',
        comprehension_score: 70,
        applied: false,
      },
      {
        sales_person_id: 'SP010',
        comprehension_score: 75,
        applied: false,
      },
    ];

    // 1回目の実行
    const first_execution_result = calculateComplianceCompletionMetrics(test_data);

    // 2回目の実行
    const second_execution_result = calculateComplianceCompletionMetrics(test_data);

    // 理解度スコア集計結果の検証
    expect(first_execution_result.comprehension_score_average).toBe(
      second_execution_result.comprehension_score_average
    );
    expect(first_execution_result.comprehension_score_average).toBe(75);

    expect(first_execution_result.comprehension_score_max).toBe(
      second_execution_result.comprehension_score_max
    );
    expect(first_execution_result.comprehension_score_max).toBe(100);

    expect(first_execution_result.comprehension_score_min).toBe(
      second_execution_result.comprehension_score_min
    );
    expect(first_execution_result.comprehension_score_min).toBe(60);

    expect(first_execution_result.comprehension_score_standard_deviation).toBe(
      second_execution_result.comprehension_score_standard_deviation
    );

    // 実務適用状況集計結果の検証
    expect(first_execution_result.applied_count).toBe(
      second_execution_result.applied_count
    );
    expect(first_execution_result.applied_count).toBe(8);

    expect(first_execution_result.not_applied_count).toBe(
      second_execution_result.not_applied_count
    );
    expect(first_execution_result.not_applied_count).toBe(2);

    expect(first_execution_result.applied_rate).toBe(
      second_execution_result.applied_rate
    );
    expect(first_execution_result.applied_rate).toBe(80);

    // 総人数の検証
    expect(first_execution_result.total_count).toBe(
      second_execution_result.total_count
    );
    expect(first_execution_result.total_count).toBe(10);
  });
});