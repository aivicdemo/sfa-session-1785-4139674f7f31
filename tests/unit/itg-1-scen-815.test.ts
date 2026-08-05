import { evaluateDetectionResultJudgment } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-815: 重要度が中程度の問題は営業部長報告対象の判定ルールに従う", () => {
    // 重要度が『中』に設定された問題検出結果オブジェクトを作成
    const detection_result = {
      detection_id: "detect_001",
      severity: "medium",
      category: "sales_process_deviation",
      description: "営業プロセス逸脱が検出されました",
      detected_at: new Date("2024-01-15T10:30:00Z"),
      confidence_score: 0.85,
    };

    // 判定ルール評価処理を実行
    const judgment_result = evaluateDetectionResultJudgment(detection_result);

    // 期待結果: 『営業部長報告対象フラグ』がtrueであり、『報告対象理由』に正しい文字列が格納されている
    expect(judgment_result.should_report_to_director).toBe(true);
    expect(judgment_result.report_reason).toBe(
      "重要度が中程度であるため営業部長への報告が必要です"
    );
  });
});