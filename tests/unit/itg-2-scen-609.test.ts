import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-609
  test("品質検証結果レポートに不合格理由の詳細が記載される", () => {
    const invalidSalesData = {
      customerId: "C001",
      customerName: "",
      phoneNumber: "090123",
      amount: -50000,
      contractDate: "2024-01-15",
    };

    const report = validateSalesDataQuality(invalidSalesData);

    expect(report.status).toBe("fail");
    expect(report.failureReasons).toHaveLength(3);

    expect(report.failureReasons).toContainEqual(
      expect.objectContaining({
        fieldName: "phoneNumber",
        message: expect.stringMatching(/電話番号形式エラー.*国内11桁形式/),
        inputValue: "090123",
        expectedFormat: "国内11桁形式",
      })
    );

    expect(report.failureReasons).toContainEqual(
      expect.objectContaining({
        fieldName: "amount",
        message: expect.stringMatching(/金額エラー.*-50000.*許容範囲.*0以上/),
        inputValue: -50000,
        expectedFormat: "0以上の数値",
      })
    );

    expect(report.failureReasons).toContainEqual(
      expect.objectContaining({
        fieldName: "customerName",
        message: expect.stringMatching(/顧客名エラー.*必須項目.*未入力/),
        inputValue: "",
        expectedFormat: "空文字列以外",
      })
    );

    expect(report.generatedAt).toBeDefined();
    expect(typeof report.generatedAt).toBe("string");
  });
});