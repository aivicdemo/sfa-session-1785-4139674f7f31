import { convertKpiCriteriaToSystemFormat } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-173
  test("KPI基準が1個定義されている場合、単一KPI基準がシステム実装可能な形式に変換される", () => {
    const input_kpi_criteria = {
      id: "kpi-001",
      name: "売上目標達成率",
      targetValue: 95,
      unit: "%",
      period: "monthly",
    };

    const result = convertKpiCriteriaToSystemFormat(input_kpi_criteria);

    expect(result.kpiId).toBe("kpi-001");
    expect(result.kpiName).toBe("売上目標達成率");
    expect(result.threshold).toBe(95);
    expect(result.measurementUnit).toBe("%");
    expect(result.evaluationCycle).toBe("monthly");
    expect(result.status).toBe("active");
    expect(result.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    );
  });
});