import { describe, test, expect } from "@jest/globals";
import { judgeComplianceCompletionByUnderstandingScore } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-1018
  test("成功パターン適用ガイドライン周知完了判定機能 - 理解度確認テストスコアが欠落しているとき処理がエラーになること", () => {
    const input_null_score = {
      sales_rep_id: "sales_rep_001",
      guideline_id: "guideline_2024_001",
      understanding_test_score: null,
      practical_application_status: "completed",
      completion_date: "2024-01-15T10:30:00Z",
    };

    expect(() =>
      judgeComplianceCompletionByUnderstandingScore(input_null_score)
    ).toThrow(/理解度確認テストスコア/);

    const input_undefined_score = {
      sales_rep_id: "sales_rep_001",
      guideline_id: "guideline_2024_001",
      understanding_test_score: undefined,
      practical_application_status: "completed",
      completion_date: "2024-01-15T10:30:00Z",
    };

    expect(() =>
      judgeComplianceCompletionByUnderstandingScore(input_undefined_score)
    ).toThrow(/理解度確認テストスコア/);
  });
});