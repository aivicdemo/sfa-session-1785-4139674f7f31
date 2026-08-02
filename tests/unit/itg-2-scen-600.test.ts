import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-600
  test("妥当性検証で金額が許容範囲下限直下を超える場合、不合格と判定される", () => {
    const minimumAmount = 1000;
    const testAmount = 999;

    const salesDataRecord = {
      amount: testAmount,
      minimumThreshold: minimumAmount,
    };

    const result = validateSalesDataQuality(salesDataRecord);

    expect(result.status).toBe("NG");
    expect(result.errorCode).toBe("VALIDATION_BELOW_MINIMUM");
    expect(result.message).toBe(
      `金額${testAmount}円は許容範囲下限${minimumAmount}円未満のため不合格`
    );
  });
});