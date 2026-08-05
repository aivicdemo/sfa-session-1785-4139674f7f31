import {
  analyzeProcessDeviationImpact,
  type ProcessDeviationAnalysisInput,
  type ProcessDeviationAnalysisOutput,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-1179
  test("標準プロセス乖離による影響可視化機能 - 標準プロセスからの乖離が成約率に与える負の影響が数値化され、可視化される", () => {
    const compliantDeal = {
      deal_id: "deal_001",
      deal_name: "準拠案件",
      process_step_count: 4,
      standard_process_step_count: 4,
      deviation_degree: 0,
      contract_completion_rate: 85,
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const deviatedDeal = {
      deal_id: "deal_002",
      deal_name: "乖離案件",
      process_step_count: 1,
      standard_process_step_count: 4,
      deviation_degree: 3,
      contract_completion_rate: 62,
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const input: ProcessDeviationAnalysisInput = {
      deals: [compliantDeal, deviatedDeal],
      analysis_period_start: new Date("2024-01-01T00:00:00Z"),
      analysis_period_end: new Date("2024-01-31T23:59:59Z"),
    };

    const result: ProcessDeviationAnalysisOutput = analyzeProcessDeviationImpact(
      input
    );

    // 成約率低下率: (85 - 62) / 85 * 100 = 27.06%
    // ここでは期待される具体的な低下率を検証
    expect(result.completion_rate_decrease_percentage).toBe(27.06);

    // 可視化データが正しく構造化されていることを確認
    expect(result.visualization_data).toBeDefined();
    expect(result.visualization_data.chart_type).toBe("bar");
    expect(result.visualization_data.title).toBe(
      "プロセス乖離による成約率への影響"
    );
    expect(result.visualization_data.x_axis_label).toBe("案件タイプ");
    expect(result.visualization_data.y_axis_label).toBe("成約率（%）");

    // グラフデータポイント検証
    expect(result.visualization_data.data_points).toHaveLength(2);

    const compliantDataPoint = result.visualization_data.data_points[0];
    expect(compliantDataPoint.label).toBe("準拠案件");
    expect(compliantDataPoint.value).toBe(85);
    expect(compliantDataPoint.deviation_degree).toBe(0);

    const deviatedDataPoint = result.visualization_data.data_points[1];
    expect(deviatedDataPoint.label).toBe("乖離案件");
    expect(deviatedDataPoint.value).toBe(62);
    expect(deviatedDataPoint.deviation_degree).toBe(3);

    // 凡例（legend）の検証
    expect(result.visualization_data.legend).toContain("標準プロセス準拠");
    expect(result.visualization_data.legend).toContain("標準プロセス乖離");

    // 数値表示の精度確認
    expect(result.impact_summary.completion_rate_compliant).toBe(85);
    expect(result.impact_summary.completion_rate_deviated).toBe(62);
    expect(result.impact_summary.rate_decrease).toBe(23);
  });
});