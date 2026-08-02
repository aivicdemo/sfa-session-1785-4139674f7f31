import { validateCorrectedDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-423
  test("修正済みデータ品質再検証 - 品質ルールが0件の場合、合格判定が返される", () => {
    const correctedData = {
      customer_id: "CUST001",
      customer_name: "テスト顧客",
      email: "test@example.com",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const qualityRules = [];

    const result = validateCorrectedDataQuality(correctedData, qualityRules);

    expect(result.status).toBe("合格");
    expect(result.failureReasons).toEqual([]);
    expect(result.failureReasons.length).toBe(0);
  });
});