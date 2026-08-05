import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  validateManagerAssignmentForProblemReview,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-841
  test("削除済みステータスの営業管理職を問題検出結果レビュー時に指定するとエラーになること", () => {
    const deleted_manager_id = "mgr_001";
    const problem_detection_result_id = "pdr_001";

    const input_data = {
      problem_detection_result_id: problem_detection_result_id,
      assigned_manager_id: deleted_manager_id,
      manager_status: "deleted",
    };

    expect(() =>
      validateManagerAssignmentForProblemReview(input_data)
    ).toThrow(/削除済みのユーザー/);
  });
});