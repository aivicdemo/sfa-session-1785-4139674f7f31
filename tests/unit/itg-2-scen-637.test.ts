import { detectDuplicateAndMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-637
  test("重複と判定されたデータペアに統合後の正規化データ案が含まれる", () => {
    const inputRecords = [
      {
        customerId: "CUST001",
        customerName: "株式会社ABC",
        phoneNumber: "03-1234-5678",
        address: "東京都渋谷区1-2-3",
        email: "contact@abc.co.jp",
        trustScore: 0.95,
      },
      {
        customerId: "CUST002",
        customerName: "(株)ABC",
        phoneNumber: "03-1234",
        address: "東京都渋谷区1-2-3",
        email: "info@abc.co.jp",
        trustScore: 0.72,
      },
    ];

    const result = detectDuplicateAndMerge({
      records: inputRecords,
      duplicateDetectionRules: [
        {
          ruleId: "RULE001",
          field1: "customerName",
          field2: "customerName",
          matchType: "fuzzy",
          threshold: 0.85,
        },
        {
          ruleId: "RULE002",
          field1: "address",
          field2: "address",
          matchType: "exact",
          threshold: 1.0,
        },
      ],
      normalizationRules: [
        {
          ruleId: "NORM001",
          fieldName: "customerName",
          pattern: "/(株|\\(株\\))/g",
          replacement: "",
          order: 1,
        },
        {
          ruleId: "NORM002",
          fieldName: "phoneNumber",
          pattern: "/(0\\d{1,4})-(\\d{1,4})(?:-(\\d{4}))?/",
          replacement: "$1-$2-$3",
          order: 2,
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.isDuplicate).toBe(true);
    expect(result.dataPair).toBeDefined();
    expect(result.dataPair.record1CustomerId).toBe("CUST001");
    expect(result.dataPair.record2CustomerId).toBe("CUST002");
    expect(result.dataPair.normalizedDataProposal).toBeDefined();
    expect(result.dataPair.normalizedDataProposal.customerName).toBe("株式会社ABC");
    expect(result.dataPair.normalizedDataProposal.phoneNumber).toBe("03-1234-5678");
    expect(result.dataPair.normalizedDataProposal.address).toBe("東京都渋谷区1-2-3");
    expect(result.dataPair.normalizedDataProposal.email).toBe("contact@abc.co.jp");
    expect(result.dataPair.normalizedDataProposal.trustScore).toBe(0.95);
    expect(result.dataPair.mergeReason).toBeDefined();
    expect(result.dataPair.confidenceScore).toBeGreaterThanOrEqual(0.85);
  });
});