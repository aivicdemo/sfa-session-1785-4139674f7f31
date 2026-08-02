import { calculateDuplicateJudgmentScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-202
  test("電話番号が完全一致するとき、重複判定スコアが満点となる", () => {
    const recordA = {
      customer_id: "CUST001",
      customer_name: "田中太郎",
      phone_number: "09012345678",
      address: "東京都渋谷区1-1-1",
      email: "tanaka@example.com",
    };

    const recordB = {
      customer_id: "CUST002",
      customer_name: "鈴木花子",
      phone_number: "09012345678",
      address: "大阪府大阪市2-2-2",
      email: "suzuki@example.com",
    };

    const score = calculateDuplicateJudgmentScore(recordA, recordB);

    expect(score).toBe(100);
  });
});