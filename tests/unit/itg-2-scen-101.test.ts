import { detectDuplicateAndCalculateScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-101
  test("電話番号が一致する場合、重複確度判定に加味される", () => {
    const customer_a = {
      name: "田中太郎",
      phone: "09012345678",
      email: "tanaka@example.com",
    };

    const customer_b = {
      name: "田中太郎",
      phone: "09012345678",
      email: "tanaka.taro@example.com",
    };

    const result = detectDuplicateAndCalculateScore(customer_a, customer_b);

    expect(result.duplicate_score).toBeGreaterThanOrEqual(70);
    expect(result.duplicate_level).toBe("重度の重複の可能性あり");
    expect(result.score_breakdown).toEqual(
      expect.objectContaining({
        phone_match_points: 30,
      })
    );
  });
});