import { calculateAiInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-837: [error] 問題検出結果のレビュー・判定機能 - レビュー実施日時が欠落している場合にエラーになること
  test("should throw validation error when review_datetime is empty string", () => {
    const detection_result_id = "det_001";
    const reviewer_id = "usr_mgr_001";
    const review_datetime = "";
    const judgment_result = "approved";
    const feedback_text = "提案内容は標準プロセスに適合している";

    expect(() =>
      calculateAiInferenceAccuracyScore({
        detection_result_id,
        reviewer_id,
        review_datetime,
        judgment_result,
        feedback_text,
      })
    ).toThrow(/レビュー実施日時/);
  });
});