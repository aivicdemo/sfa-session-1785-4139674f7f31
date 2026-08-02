import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-212
  test("住所が異なるとき、重複判定スコアが低下する", () => {
    const customer_record_1 = {
      customer_id: "C001",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const customer_record_2 = {
      customer_id: "C002",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: "大阪府大阪市北区中之島3-3-3",
    };

    const customer_record_3_same_address = {
      customer_id: "C003",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const result_different_address = detectDuplicateCustomers([
      customer_record_1,
      customer_record_2,
    ]);

    const result_same_address = detectDuplicateCustomers([
      customer_record_1,
      customer_record_3_same_address,
    ]);

    const score_different_address = result_different_address.duplicate_score;
    const score_same_address = result_same_address.duplicate_score;

    expect(score_same_address - score_different_address).toBeGreaterThanOrEqual(
      5
    );
    expect(score_different_address).toBeLessThanOrEqual(80);
    expect(score_same_address).toBeGreaterThanOrEqual(85);
  });
});