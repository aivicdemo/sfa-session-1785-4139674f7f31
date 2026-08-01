import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { validateSuccessPatternTrainingCompletion } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-741: [error] 成功パターン適用ガイドラインの周知完了判定機能 - 研修完了状態が欠落している営業担当者レコードが存在するときエラーが発生する
  test("should throw error with INCOMPLETE_TRAINING_STATUS_DETECTED when sales rep has null completion_status", () => {
    const sales_reps = [
      {
        id: "SR001",
        name: "営業太郎",
        completion_status: "completed",
        training_completion_date: "2024-01-15",
        guideline_acknowledgement_date: "2024-01-16",
      },
      {
        id: "SR002",
        name: "営業花子",
        completion_status: null,
        training_completion_date: null,
        guideline_acknowledgement_date: null,
      },
      {
        id: "SR003",
        name: "営業次郎",
        completion_status: "completed",
        training_completion_date: "2024-01-14",
        guideline_acknowledgement_date: "2024-01-15",
      },
    ];

    expect(() => {
      validateSuccessPatternTrainingCompletion(sales_reps);
    }).toThrow(/INCOMPLETE_TRAINING_STATUS_DETECTED/);
  });
});