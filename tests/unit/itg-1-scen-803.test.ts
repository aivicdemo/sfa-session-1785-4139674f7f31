import { describe, test, expect } from "@jest/globals";
import { calculateBehaviorPatternCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-803: 成約実績が複数件のとき、全件の成約結果から行動パターンとの相関を計算する", () => {
    const salesPersonId = "SP001";

    const contractResults = [
      {
        contractId: "Contract001",
        contractDate: new Date("2024-01-15T10:00:00Z"),
        productCategory: "software",
        customerIndustry: "finance",
        negotiationDays: 30,
        initialContactMethod: "email",
      },
      {
        contractId: "Contract002",
        contractDate: new Date("2024-02-20T14:30:00Z"),
        productCategory: "consulting",
        customerIndustry: "manufacturing",
        negotiationDays: 45,
        initialContactMethod: "phone",
      },
      {
        contractId: "Contract003",
        contractDate: new Date("2024-03-10T09:15:00Z"),
        productCategory: "hardware",
        customerIndustry: "retail",
        negotiationDays: 20,
        initialContactMethod: "visit",
      },
    ];

    const behaviorPatterns = {
      emailFrequency: 8,
      visitCount: 5,
      proposalDocumentTiming: 7,
      initialContactMethod: "email",
      followUpInterval: 3,
    };

    const result = calculateBehaviorPatternCorrelation(
      salesPersonId,
      contractResults,
      behaviorPatterns
    );

    expect(result).toHaveLength(3);

    expect(result[0].contractId).toBe("Contract001");
    expect(result[0].correlationCoefficient).toBe(0.87);
    expect(result[0].targetBehaviorIndicators).toEqual([
      "emailFrequency",
      "visitCount",
    ]);
    expect(result[0].correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result[0].correlationCoefficient).toBeLessThanOrEqual(1.0);

    expect(result[1].contractId).toBe("Contract002");
    expect(result[1].correlationCoefficient).toBe(0.72);
    expect(result[1].targetBehaviorIndicators).toEqual([
      "proposalDocumentTiming",
    ]);
    expect(result[1].correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result[1].correlationCoefficient).toBeLessThanOrEqual(1.0);

    expect(result[2].contractId).toBe("Contract003");
    expect(result[2].correlationCoefficient).toBe(0.65);
    expect(result[2].targetBehaviorIndicators).toEqual([
      "initialContactMethod",
      "emailFrequency",
    ]);
    expect(result[2].correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result[2].correlationCoefficient).toBeLessThanOrEqual(1.0);

    const allContractIds = result.map((item) => item.contractId);
    expect(allContractIds).toContain("Contract001");
    expect(allContractIds).toContain("Contract002");
    expect(allContractIds).toContain("Contract003");
    expect(allContractIds).toHaveLength(3);
  });
});