import { detectPurchaseSignalRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-764
  test("[normal] 信号検出根拠生成機能 - 反応パターンのみが存在するとき、根拠に反応パターンだけが記載される", () => {
    const reactionPatternId = "PAT-001";
    const reactionContent = "顧客が営業資料を3回以上閲覧";
    const detectionTimestamp = new Date("2024-01-15T09:30:00Z");

    const input = {
      reaction_pattern_id: reactionPatternId,
      reaction_content: reactionContent,
      detection_timestamp: detectionTimestamp,
      external_marketing_data: undefined,
      crm_system_data: undefined,
    };

    const result = detectPurchaseSignalRationale(input);

    expect(result).toEqual({
      rationale_id: expect.any(String),
      signal_strength: "strong",
      rationale_source: "reaction_pattern",
      reaction_pattern: {
        pattern_id: reactionPatternId,
        reaction_content: reactionContent,
        detection_timestamp: detectionTimestamp,
      },
      external_marketing_rationale: null,
      crm_system_rationale: null,
      generated_at: expect.any(Date),
    });

    expect(result.rationale_source).toBe("reaction_pattern");
    expect(result.reaction_pattern.pattern_id).toBe(reactionPatternId);
    expect(result.reaction_pattern.reaction_content).toBe(reactionContent);
    expect(result.external_marketing_rationale).toBeNull();
    expect(result.crm_system_rationale).toBeNull();
  });
});