import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-671
  test("推奨内容根拠の可視化機能 - 過去事例に重複データが含まれるとき、重複が排除される", () => {
    const caseId = "CASE-001";
    const rationales = [
      {
        rationale_id: "REASON-A",
        content: "類似業種での成功事例",
      },
      {
        rationale_id: "REASON-A",
        content: "類似業種での成功事例",
      },
    ];

    const result = visualizeRecommendationRationale({
      case_id: caseId,
      rationales: rationales,
    });

    expect(result.rationales).toHaveLength(1);
    expect(result.rationales[0]).toEqual({
      rationale_id: "REASON-A",
      content: "類似業種での成功事例",
    });
    expect(result.duplicate_count_removed).toBe(1);
  });
});