import { judgeMergeCandidacy } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-114
  test("重複確度が79%の場合、統合対象ではないと判定される", () => {
    const recordA = {
      customerId: "CUST-001",
      name: "山田太郎",
      address: "東京都渋谷区道玄坂1-1-1",
      phoneNumber: "090-1234-5678",
    };

    const recordB = {
      customerId: "CUST-002",
      name: "山田太郎",
      address: "東京都渋谷区道玄坂1丁目1番1号",
      phoneNumber: "09012345678",
    };

    const result = judgeMergeCandidacy(recordA, recordB, {
      confidenceThreshold: 80,
      confidenceScore: 79,
    });

    expect(result.isMergeCandidate).toBe(false);
    expect(result.reasonCode).toMatch(/CONFIDENCE_BELOW_THRESHOLD|NOT_ELIGIBLE_FOR_MERGE/);
  });
});