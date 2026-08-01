import { selectBehaviorPatternIndicators } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-774
  test("[normal] 行動パターン分析対象指標の自動選定機能 - AIエージェント推論精度監視時に選定された指標が監視対象として設定される", () => {
    const ai_inference_score = 0.87;
    const candidate_indicators = [
      "営業成約率",
      "初回接触率",
      "提案数",
      "フォローアップ間隔",
      "顧客接触頻度"
    ];
    const selection_timestamp = new Date("2024-01-15T11:00:00Z");

    const result = selectBehaviorPatternIndicators({
      ai_inference_score: ai_inference_score,
      candidate_indicators: candidate_indicators,
      selection_timestamp: selection_timestamp
    });

    expect(result).toEqual({
      selected_indicators: [
        {
          indicator_name: "営業成約率",
          monitoring_status: "active",
          selection_timestamp: selection_timestamp,
          ai_inference_score: 0.87
        },
        {
          indicator_name: "初回接触率",
          monitoring_status: "active",
          selection_timestamp: selection_timestamp,
          ai_inference_score: 0.87
        }
      ],
      selection_count: 2,
      total_candidate_count: 5
    });
  });
});