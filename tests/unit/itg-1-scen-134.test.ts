import { describe, test, expect, beforeEach } from "@jest/globals";
import { validateAiInferenceAuthority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論実行前データ品質検証機能", () => {
  // SCEN-134
  test("営業管理職の権限が不足しているとき推論実行指示が拒否される", () => {
    const insufficientAuthorityUser = {
      userId: "user-001",
      authorityLevel: 2,
      departmentId: "dept-sales",
      role: "sales_manager",
    };

    const inferenceRequest = {
      targetDataType: "customer_segment_analysis",
      executionTimestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      requestingUserId: insufficientAuthorityUser.userId,
      requestingAuthorityLevel: insufficientAuthorityUser.authorityLevel,
    };

    expect(() => {
      validateAiInferenceAuthority(inferenceRequest);
    }).toThrow(/権限/);
  });
});