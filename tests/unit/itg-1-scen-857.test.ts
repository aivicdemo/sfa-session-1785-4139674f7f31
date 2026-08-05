import { evaluateProblemDetectionResult } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-857: 検出期間の開始日と終了日が同日のとき判定処理が正常に実行される", () => {
    // 同日の開始日と終了日を設定
    const detectionStartDate = new Date("2024-01-15T00:00:00Z");
    const detectionEndDate = new Date("2024-01-15T23:59:59Z");

    // 問題検出結果オブジェクトを準備
    const problemDetectionResult = {
      detectionDateTime: new Date("2024-01-15T10:30:00Z"),
      problemContent: "営業目標未達成",
      detectionCount: 3,
    };

    // 判定機能を呼び出す
    const judgmentResult = evaluateProblemDetectionResult(
      problemDetectionResult,
      detectionStartDate,
      detectionEndDate
    );

    // 戻り値の判定結果オブジェクトを検証
    expect(judgmentResult.importance).toBe("高");
    expect(judgmentResult.rationale).toBe(
      "同一日内に3件の営業目標未達成が検出されたため"
    );
    expect(judgmentResult.responseNecessity).toBe("必須");
    expect(judgmentResult.processingStatus).toBe("成功");
  });
});