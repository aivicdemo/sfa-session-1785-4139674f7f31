import { detectAndJudgeDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-208: 複数の照合属性が全て一致するとき、統合判定結果が承認可能状態となる", () => {
    const customerRecord1 = {
      customerId: "CUST-12345",
      email: "customer@example.com",
      phoneNumber: "09012345678",
    };

    const customerRecord2 = {
      customerId: "CUST-12345",
      email: "customer@example.com",
      phoneNumber: "09012345678",
    };

    const result = detectAndJudgeDuplicateCustomers(
      customerRecord1,
      customerRecord2
    );

    expect(result.status).toBe("承認可能");
    expect(result.canApprove).toBe(true);
    expect(result.duplicateLevel).toBe("完全一致");
  });
});