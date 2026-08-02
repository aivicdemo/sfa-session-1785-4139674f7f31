import { normalizeAndMergeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1178
  test("正規化対象の住所に複数の半角スペースが含まれている場合、スペースが正規化される", () => {
    const input_customer_data = {
      customer_id: "C001",
      customer_name: "テスト顧客",
      address: "東京都  渋谷区   道玄坂  1-2-3",
      phone: "03-1234-5678",
      email: "test@example.com",
    };

    const result = normalizeAndMergeCustomerData(input_customer_data);

    expect(result.address).toBe("東京都渋谷区道玄坂1-2-3");
  });
});