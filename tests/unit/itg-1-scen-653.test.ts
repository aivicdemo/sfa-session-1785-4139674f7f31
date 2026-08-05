import {
  calculateDeviationDegree,
  generateBehaviorPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-653: 行動パターン分析結果の乖離度計算で端数が発生するとき、指定の丸め方式に従って正確に丸められる", () => {
    // 初期化: 丸め方式を「四捨五入、小数第1位」に設定
    const roundingMethodRound = "round";
    const decimalPlaces = 1;

    // 1件目: 訪問回数: 47回、期待値: 50回
    // 乖離度 = |47 - 50| / 50 × 100 = 6%
    const salesperson_1 = {
      id: "sp_001",
      actual_visits: 47,
      expected_visits: 50,
    };

    const deviation_1 = calculateDeviationDegree(
      salesperson_1.actual_visits,
      salesperson_1.expected_visits,
      roundingMethodRound,
      decimalPlaces
    );

    expect(deviation_1).toBe(6.0);

    // 2件目: 訪問回数: 33回、期待値: 50回
    // 乖離度 = |33 - 50| / 50 × 100 = 34%
    const salesperson_2 = {
      id: "sp_002",
      actual_visits: 33,
      expected_visits: 50,
    };

    const deviation_2 = calculateDeviationDegree(
      salesperson_2.actual_visits,
      salesperson_2.expected_visits,
      roundingMethodRound,
      decimalPlaces
    );

    expect(deviation_2).toBe(34.0);

    // 丸め方式を「切り上げ、小数第1位」に変更
    const roundingMethodCeil = "ceil";

    // 3件目: 訪問回数: 26回、期待値: 50回
    // 乖離度 = |26 - 50| / 50 × 100 = 48%
    // 切り上げで小数第1位なので 48.0 → 48.1（切り上げ）
    const salesperson_3 = {
      id: "sp_003",
      actual_visits: 26,
      expected_visits: 50,
    };

    const deviation_3 = calculateDeviationDegree(
      salesperson_3.actual_visits,
      salesperson_3.expected_visits,
      roundingMethodCeil,
      decimalPlaces
    );

    expect(deviation_3).toBe(48.1);

    // レポート生成: 複数の営業担当者データを統合
    const report = generateBehaviorPatternAnalysisReport(
      [
        {
          salesperson_id: salesperson_1.id,
          actual_visits: salesperson_1.actual_visits,
          expected_visits: salesperson_1.expected_visits,
          rounding_method: roundingMethodRound,
          decimal_places: decimalPlaces,
        },
        {
          salesperson_id: salesperson_2.id,
          actual_visits: salesperson_2.actual_visits,
          expected_visits: salesperson_2.expected_visits,
          rounding_method: roundingMethodRound,
          decimal_places: decimalPlaces,
        },
        {
          salesperson_id: salesperson_3.id,
          actual_visits: salesperson_3.actual_visits,
          expected_visits: salesperson_3.expected_visits,
          rounding_method: roundingMethodCeil,
          decimal_places: decimalPlaces,
        },
      ],
      {
        report_generated_at: "2024-01-15T11:00:00Z",
        generated_by_agent_id: "ai_agent_001",
      }
    );

    // レポートの乖離度が正確に丸められていることを確認
    expect(report.analysis_results).toHaveLength(3);

    // 1件目: 四捨五入で 6.0%
    expect(report.analysis_results[0].salesperson_id).toBe(salesperson_1.id);
    expect(report.analysis_results[0].deviation_degree).toBe(6.0);

    // 2件目: 四捨五入で 34.0%
    expect(report.analysis_results[1].salesperson_id).toBe(salesperson_2.id);
    expect(report.analysis_results[1].deviation_degree).toBe(34.0);

    // 3件目: 切り上げで 48.1%
    expect(report.analysis_results[2].salesperson_id).toBe(salesperson_3.id);
    expect(report.analysis_results[2].deviation_degree).toBe(48.1);

    // レポートメタデータの確認
    expect(report.report_generated_at).toBe("2024-01-15T11:00:00Z");
    expect(report.generated_by_agent_id).toBe("ai_agent_001");
  });
});