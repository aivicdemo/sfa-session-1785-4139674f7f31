import { validateComprehensionScoreCompletion } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-727
  test("成功パターン適用ガイドラインの周知完了判定機能 - 理解度スコアが欠落している営業担当者レコードが存在するときエラーが発生する", () => {
    const sales_reps = [
      {
        sales_rep_id: "SR001",
        comprehension_score: 85,
      },
      {
        sales_rep_id: "SR002",
        comprehension_score: null,
      },
      {
        sales_rep_id: "SR003",
        comprehension_score: 92,
      },
    ];

    expect(() => validateComprehensionScoreCompletion(sales_reps)).toThrow(
      /理解度スコアが欠落しています。営業担当者ID: SR002/
    );

    try {
      validateComprehensionScoreCompletion(sales_reps);
    } catch (error) {
      expect((error as any).code).toBe("ERR_MISSING_COMPREHENSION_SCORE");
    }
  });
});