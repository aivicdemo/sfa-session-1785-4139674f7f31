import { calculateDuplicateDetectionScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-199
  test("メールアドレスが完全一致するとき、重複判定スコアが満点となる", () => {
    const customerA = {
      email: "test@example.com",
      name: "山田太郎",
      address: "東京都渋谷区",
    };

    const customerB = {
      email: "test@example.com",
      name: "山田太郎",
      address: "東京都渋谷区",
    };

    const score = calculateDuplicateDetectionScore(customerA, customerB);

    expect(score).toBe(100);
  });
});