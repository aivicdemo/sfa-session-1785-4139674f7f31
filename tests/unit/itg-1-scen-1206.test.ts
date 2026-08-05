import { describe, test, expect } from "@jest/globals";
import { calculateCorrelationAnalysisReport } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1206
  test("相関分析レポート生成時にサンプルデータが最小要件未満のとき400エラーを返す", () => {
    const insufficient_samples_1 = [
      {
        sales_rep_id: "rep_001",
        process_adherence_score: 85,
        contract_result: 1,
      },
    ];

    const error_result_1 = calculateCorrelationAnalysisReport(
      insufficient_samples_1
    );

    expect(error_result_1.status_code).toBe(400);
    expect(error_result_1.error_message).toMatch(/相関係数計算に必要な最小サンプル数3件/);
    expect(error_result_1.error_message).toMatch(/1件/);
    expect(error_result_1.report_data).toBeUndefined();

    const insufficient_samples_2 = [
      {
        sales_rep_id: "rep_002",
        process_adherence_score: 92,
        contract_result: 1,
      },
      {
        sales_rep_id: "rep_003",
        process_adherence_score: 78,
        contract_result: 0,
      },
    ];

    const error_result_2 = calculateCorrelationAnalysisReport(
      insufficient_samples_2
    );

    expect(error_result_2.status_code).toBe(400);
    expect(error_result_2.error_message).toMatch(/相関係数計算に必要な最小サンプル数3件/);
    expect(error_result_2.error_message).toMatch(/2件/);
    expect(error_result_2.report_data).toBeUndefined();
  });
});