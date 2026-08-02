import { generateSignalDetectionRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-763
  test("信号検出根拠生成機能 - 購買周期のみが存在するとき、根拠に購買周期だけが記載される", () => {
    const input = {
      purchase_cycle_days: 30,
      customer_segment: undefined,
      transaction_amount: undefined,
      last_contact_date: undefined,
    };

    const result = generateSignalDetectionRationale(input);

    expect(result).toEqual({
      purchase_cycle: "30日",
    });
    expect(Object.keys(result)).toHaveLength(1);
    expect(result).not.toHaveProperty("customer_segment");
    expect(result).not.toHaveProperty("transaction_amount");
    expect(result).not.toHaveProperty("last_contact_date");
  });
});