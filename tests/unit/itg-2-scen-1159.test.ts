import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1159
  test("データ品質ルールが0件の場合、検証スキップされて全データが正常と判定される", () => {
    const testSalesData = [
      {
        customerId: "CUST001",
        customerName: "株式会社ABC",
        revenue: 5000000,
        productId: "PROD-001",
        transactionDate: "2024-01-15",
      },
      {
        customerId: "CUST002",
        customerName: "株式会社XYZ",
        revenue: 3500000,
        productId: "PROD-002",
        transactionDate: "2024-01-16",
      },
      {
        customerId: "CUST003",
        customerName: "株式会社DEF",
        revenue: 7200000,
        productId: "PROD-003",
        transactionDate: "2024-01-17",
      },
    ];

    const emptyRules: any[] = [];

    const result = validateSalesDataQuality({
      salesData: testSalesData,
      qualityRules: emptyRules,
    });

    expect(result.status).toBe("skipped");
    expect(result.totalRecords).toBe(3);
    expect(result.normalRecords).toBe(3);
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
    expect(result.records).toEqual([
      {
        customerId: "CUST001",
        customerName: "株式会社ABC",
        revenue: 5000000,
        productId: "PROD-001",
        transactionDate: "2024-01-15",
        status: "normal",
      },
      {
        customerId: "CUST002",
        customerName: "株式会社XYZ",
        revenue: 3500000,
        productId: "PROD-002",
        transactionDate: "2024-01-16",
        status: "normal",
      },
      {
        customerId: "CUST003",
        customerName: "株式会社DEF",
        revenue: 7200000,
        productId: "PROD-003",
        transactionDate: "2024-01-17",
        status: "normal",
      },
    ]);
  });
});