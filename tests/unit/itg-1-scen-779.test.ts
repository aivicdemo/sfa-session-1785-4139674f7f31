import { classifyDetectionResultByImportanceAndPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-779
  test("問題検出結果の重要度・優先度分類機能 - 同じ問題検出結果を複数回処理しても、同じ分類結果が返される", () => {
    const detection_result = {
      detection_id: "DET_20240115_001",
      detection_datetime: new Date("2024-01-15T10:30:00Z"),
      detection_content: "営業段階の未更新案件が30日以上存在",
      target_department: "営業部",
      affected_count: 5,
      severity_indicator: 0.85,
    };

    // 1回目の分類実行
    const result_1 = classifyDetectionResultByImportanceAndPriority(
      detection_result
    );

    // 2回目の分類実行
    const result_2 = classifyDetectionResultByImportanceAndPriority(
      detection_result
    );

    // 3回目の分類実行
    const result_3 = classifyDetectionResultByImportanceAndPriority(
      detection_result
    );

    // 1回目・2回目・3回目の分類結果が完全に一致することを検証
    expect(result_1.importance).toBe("高");
    expect(result_1.priority).toBe(1);

    expect(result_2.importance).toBe("高");
    expect(result_2.priority).toBe(1);

    expect(result_3.importance).toBe("高");
    expect(result_3.priority).toBe(1);

    // 全回答の一致性を検証
    expect(result_1).toEqual(result_2);
    expect(result_2).toEqual(result_3);
    expect(result_1).toEqual(result_3);
  });
});