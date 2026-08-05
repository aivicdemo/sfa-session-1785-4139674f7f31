import { describe, test, expect } from "@jest/globals";
import { convertProcessStandardsToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス標準書のシステム要件変換機能", () => {
  // SCEN-200
  test("判定基準の精度が許容範囲下限値超過のとき、要件として受け入れられる", () => {
    const input_judgment_criteria = {
      precision_percentage: -4.9,
      tolerance_lower_limit: -5.0,
      tolerance_upper_limit: 5.0,
      criteria_id: "JC-001",
      criteria_name: "営業プロセス遵守率",
      standard_process_id: "SP-2024-Q1",
    };

    const result = convertProcessStandardsToSystemRequirements(
      input_judgment_criteria
    );

    expect(result.acceptance_status).toBe("acceptable");
    expect(result.is_within_tolerance).toBe(true);
    expect(result.precision_percentage).toBe(-4.9);
    expect(result.tolerance_lower_limit).toBe(-5.0);
    expect(result.exceeds_lower_limit).toBe(true);
    expect(result.conversion_completed).toBe(true);
    expect(result.requirement_registered).toBe(true);
  });
});