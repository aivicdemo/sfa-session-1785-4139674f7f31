import { describe, test, expect } from "@jest/globals";
import { validateSuccessPatternGuidanceCompletion } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-732
  test("成功パターン適用ガイドラインの周知完了判定機能 - 営業担当者IDが欠落しているレコードが存在するときエラーが発生する", () => {
    const guidanceDataset = [
      {
        guidanceId: "GD001",
        salesPersonId: "SP001",
        guidanceContent: "成功パターンA",
        comprehensionScore: 85,
        practicumApplicationStatus: "completed",
        submittedAt: new Date("2024-11-15T10:00:00Z"),
      },
      {
        guidanceId: "GD002",
        salesPersonId: undefined,
        guidanceContent: "成功パターンB",
        comprehensionScore: 90,
        practicumApplicationStatus: "completed",
        submittedAt: new Date("2024-11-15T11:00:00Z"),
      },
      {
        guidanceId: "GD003",
        salesPersonId: "SP003",
        guidanceContent: "成功パターンC",
        comprehensionScore: 92,
        practicumApplicationStatus: "completed",
        submittedAt: new Date("2024-11-15T12:00:00Z"),
      },
    ];

    expect(() => validateSuccessPatternGuidanceCompletion(guidanceDataset)).toThrow(
      /営業担当者ID/
    );
  });
});