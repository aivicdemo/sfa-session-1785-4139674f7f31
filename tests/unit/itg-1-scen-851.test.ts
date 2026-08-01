import { analyzeProcessDeviationAndCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業プロセス標準書との乖離分析と成約実績の相関分析", () => {
  test("SCEN-851: 乖離度が50%の場合、中程度乖離として記録する", () => {
    // 入力準備：標準プロセス期待値を100、実績値を50に設定
    const test_input = {
      sales_rep_id: "rep_001",
      standard_process_expected_value: 100,
      actual_performance_value: 50,
      analysis_period_start: "2024-01-01",
      analysis_period_end: "2024-01-31",
      contract_results: 1,
    };

    // 実行：乖離度計算ロジック（実績値 ÷ 期待値 × 100）を実行
    const result = analyzeProcessDeviationAndCorrelation(test_input);

    // 検証：乖離度50%が算出されている
    expect(result.deviation_percentage).toBe(50);

    // 検証：乖離レベルが「中程度乖離」として判定されている
    expect(result.deviation_level).toBe(2);
    expect(result.deviation_status).toBe("MEDIUM");

    // 検証：計算に使用された元データセットがメタデータとして紐付けられている
    expect(result.calculation_metadata).toEqual({
      standard_expected_value: 100,
      actual_performance_value: 50,
      formula: "(50/100)*100",
    });

    // 検証：タイムスタンプが記録されている
    expect(result.recorded_at).toBeDefined();
    expect(typeof result.recorded_at).toBe("string");

    // 検証：レコードが保存済みの状態を示すID が付与されている
    expect(result.record_id).toBeDefined();
    expect(typeof result.record_id).toBe("string");

    // 検証：乖離度とデータが一貫している
    expect(result.deviation_percentage).toBeGreaterThanOrEqual(0);
    expect(result.deviation_percentage).toBeLessThanOrEqual(100);
  });
});