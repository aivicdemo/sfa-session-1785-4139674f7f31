import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-374
  test("行動パターンの発生件数が多い順に並んでいることが検証される", () => {
    const testDataset = {
      salesReps: [
        {
          id: "rep_A",
          name: "営業担当者A",
          patterns: [
            { patternType: "visit", count: 5 },
            { patternType: "email", count: 8 },
            { patternType: "proposal_document", count: 3 }
          ]
        },
        {
          id: "rep_B",
          name: "営業担当者B",
          patterns: [
            { patternType: "call", count: 6 },
            { patternType: "visit", count: 4 }
          ]
        },
        {
          id: "rep_C",
          name: "営業担当者C",
          patterns: [
            { patternType: "email", count: 10 },
            { patternType: "call", count: 2 },
            { patternType: "visit", count: 7 }
          ]
        }
      ]
    };

    const report = generateSalesActivityPatternReport(testDataset);

    const repAPatterns = report.find(
      (entry: { salesRepId: string }) => entry.salesRepId === "rep_A"
    );

    expect(repAPatterns).toBeDefined();
    expect(repAPatterns.patterns).toHaveLength(3);

    expect(repAPatterns.patterns[0]).toEqual({
      patternType: "email",
      count: 8
    });

    expect(repAPatterns.patterns[1]).toEqual({
      patternType: "visit",
      count: 5
    });

    expect(repAPatterns.patterns[2]).toEqual({
      patternType: "proposal_document",
      count: 3
    });
  });
});