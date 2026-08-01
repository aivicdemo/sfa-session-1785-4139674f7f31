import { describe, test, expect } from "@jest/globals";
import { generateSalesRepActionPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-650
  test("営業担当者の情報が不完全（ID欠落）の場合、エラーまたはスキップされる", () => {
    const incompleteDataset = [
      {
        salesRepId: null,
        salesRepName: "営業太郎",
        totalProposals: 10,
        successCount: 3,
        contactFrequency: 5,
        followUpInterval: 7,
        processDeviation: 15.5,
        contractAmount: 500000,
      },
      {
        salesRepId: undefined,
        salesRepName: "営業花子",
        totalProposals: 8,
        successCount: 2,
        contactFrequency: 4,
        followUpInterval: 5,
        processDeviation: 22.3,
        contractAmount: 350000,
      },
      {
        salesRepId: "REP-003",
        salesRepName: "営業次郎",
        totalProposals: 12,
        successCount: 5,
        contactFrequency: 6,
        followUpInterval: 6,
        processDeviation: 10.2,
        contractAmount: 750000,
      },
    ];

    const result = generateSalesRepActionPatternReport(incompleteDataset);

    expect(result).toBeDefined();
    expect(result.status).toBe("completed");
    expect(result.skippedCount).toBe(2);
    expect(result.processedCount).toBe(1);
    expect(result.reportData).toBeDefined();
    expect(result.reportData.length).toBe(1);
    expect(result.reportData[0].salesRepId).toBe("REP-003");
    expect(result.errors).toBeDefined();
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toMatch(/営業担当者ID/);
  });
});