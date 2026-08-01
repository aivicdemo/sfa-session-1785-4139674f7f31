import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesRepresentativeActionPatternAnalysisReports } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-334
  test("営業担当者が複数人の場合、全担当者のレポートが生成される", () => {
    const input = {
      salesRepresentatives: [
        {
          id: "rep_001",
          name: "田中太郎",
          department: "営業部",
        },
        {
          id: "rep_002",
          name: "鈴木花子",
          department: "営業部",
        },
        {
          id: "rep_003",
          name: "佐藤次郎",
          department: "営業部",
        },
      ],
      salesActivitiesData: [
        {
          repId: "rep_001",
          date: "2024-11-15",
          visitCount: 5,
          proposalCount: 3,
          contractCount: 1,
        },
        {
          repId: "rep_001",
          date: "2024-11-20",
          visitCount: 4,
          proposalCount: 2,
          contractCount: 0,
        },
        {
          repId: "rep_001",
          date: "2024-12-10",
          visitCount: 6,
          proposalCount: 4,
          contractCount: 2,
        },
        {
          repId: "rep_002",
          date: "2024-11-18",
          visitCount: 3,
          proposalCount: 2,
          contractCount: 1,
        },
        {
          repId: "rep_002",
          date: "2024-11-25",
          visitCount: 5,
          proposalCount: 3,
          contractCount: 1,
        },
        {
          repId: "rep_002",
          date: "2024-12-08",
          visitCount: 4,
          proposalCount: 2,
          contractCount: 0,
        },
        {
          repId: "rep_003",
          date: "2024-11-16",
          visitCount: 7,
          proposalCount: 4,
          contractCount: 2,
        },
        {
          repId: "rep_003",
          date: "2024-11-22",
          visitCount: 5,
          proposalCount: 3,
          contractCount: 1,
        },
        {
          repId: "rep_003",
          date: "2024-12-09",
          visitCount: 6,
          proposalCount: 3,
          contractCount: 1,
        },
      ],
      analysisStartDate: "2024-11-12",
      analysisEndDate: "2024-12-11",
    };

    const result = generateSalesRepresentativeActionPatternAnalysisReports(
      input
    );

    expect(result.reportFiles).toHaveLength(3);

    const tanakaTaroReport = result.reportFiles.find(
      (f) => f.fileName === "営業担当者分析レポート_田中太郎_20241112-20241211.pdf"
    );
    expect(tanakaTaroReport).toBeDefined();
    expect(tanakaTaroReport?.salesRepName).toBe("田中太郎");
    expect(tanakaTaroReport?.analysisPeriod).toBe("2024-11-12 ～ 2024-12-11");
    expect(tanakaTaroReport?.averageVisitCount).toBe(5);
    expect(tanakaTaroReport?.proposalCounts).toEqual([3, 2, 4]);
    expect(tanakaTaroReport?.contractRate).toBe(0.33);
    expect(tanakaTaroReport?.actionPatterns).toContain("高頻度訪問型");

    const suzukiHanakoReport = result.reportFiles.find(
      (f) => f.fileName === "営業担当者分析レポート_鈴木花子_20241112-20241211.pdf"
    );
    expect(suzukiHanakoReport).toBeDefined();
    expect(suzukiHanakoReport?.salesRepName).toBe("鈴木花子");
    expect(suzukiHanakoReport?.analysisPeriod).toBe("2024-11-12 ～ 2024-12-11");
    expect(suzukiHanakoReport?.averageVisitCount).toBe(4);
    expect(suzukiHanakoReport?.proposalCounts).toEqual([2, 3, 2]);
    expect(suzukiHanakoReport?.contractRate).toBe(0.33);
    expect(suzukiHanakoReport?.actionPatterns).toContain("安定型");

    const satohJiroReport = result.reportFiles.find(
      (f) => f.fileName === "営業担当者分析レポート_佐藤次郎_20241112-20241211.pdf"
    );
    expect(satohJiroReport).toBeDefined();
    expect(satohJiroReport?.salesRepName).toBe("佐藤次郎");
    expect(satohJiroReport?.analysisPeriod).toBe("2024-11-12 ～ 2024-12-11");
    expect(satohJiroReport?.averageVisitCount).toBe(6);
    expect(satohJiroReport?.proposalCounts).toEqual([4, 3, 3]);
    expect(satohJiroReport?.contractRate).toBe(0.4);
    expect(satohJiroReport?.actionPatterns).toContain("積極型");
  });
});