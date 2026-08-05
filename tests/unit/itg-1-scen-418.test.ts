import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { judgeSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1";

describe("成功パターン適用判定機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-418
  test("入力データセットに重複する成功パターンIDが含まれる場合、重複を排除して判定される", async () => {
    const input_success_pattern_ids = [
      "SP-001",
      "SP-002",
      "SP-001",
      "SP-003",
      "SP-002",
    ];

    const result = await judgeSuccessPatternApplicability({
      success_pattern_ids: input_success_pattern_ids,
    });

    const unique_pattern_ids = Array.from(new Set(result.applicable_pattern_ids));

    expect(result.applicable_pattern_ids.length).toBe(3);
    expect(unique_pattern_ids).toEqual(["SP-001", "SP-002", "SP-003"]);
    expect(result.applicable_pattern_ids.filter((id) => id === "SP-001").length).toBe(1);
    expect(result.applicable_pattern_ids.filter((id) => id === "SP-002").length).toBe(1);
    expect(result.applicable_pattern_ids.filter((id) => id === "SP-003").length).toBe(1);
  });
});