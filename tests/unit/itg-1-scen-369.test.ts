import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-369: 成功パターンとして複数の行動パターンが共存するとき、全てが抽出される", () => {
    const salesRepId = "A001";
    const analysisStartDate = "2024-01-01";
    const analysisEndDate = "2024-03-31";

    const activityData = [
      {
        salesRepId: "A001",
        customerId: "C001",
        activityDate: "2024-01-05",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C001",
        activityDate: "2024-01-10",
        activityType: "proposal",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C001",
        activityDate: "2024-01-20",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C002",
        activityDate: "2024-01-08",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C002",
        activityDate: "2024-01-15",
        activityType: "proposal",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C002",
        activityDate: "2024-01-25",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C003",
        activityDate: "2024-02-01",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C003",
        activityDate: "2024-02-08",
        activityType: "proposal",
        result: "failure",
      },
      {
        salesRepId: "A001",
        customerId: "C003",
        activityDate: "2024-02-20",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C004",
        activityDate: "2024-02-05",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C004",
        activityDate: "2024-02-12",
        activityType: "proposal",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C004",
        activityDate: "2024-02-25",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C005",
        activityDate: "2024-02-10",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C005",
        activityDate: "2024-02-18",
        activityType: "document_send",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C005",
        activityDate: "2024-03-02",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C006",
        activityDate: "2024-02-15",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C006",
        activityDate: "2024-02-22",
        activityType: "document_send",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C006",
        activityDate: "2024-03-05",
        activityType: "closing",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C007",
        activityDate: "2024-03-01",
        activityType: "initial_contact",
        result: "success",
      },
      {
        salesRepId: "A001",
        customerId: "C007",
        activityDate: "2024-03-08",
        activityType: "document_send",
        result: "failure",
      },
      {
        salesRepId: "A001",
        customerId: "C007",
        activityDate: "2024-03-20",
        activityType: "closing",
        result: "success",
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesRepId,
      analysisStartDate,
      analysisEndDate,
      activityData,
    });

    expect(report.successPatterns).toHaveLength(2);

    const patternA = report.successPatterns.find(
      (p: { patternSteps: string[] }) =>
        p.patternSteps[0] === "initial_contact" &&
        p.patternSteps[1] === "proposal" &&
        p.patternSteps[2] === "closing"
    );

    expect(patternA).toBeDefined();
    expect(patternA.transitionStepCount).toBe(3);
    expect(patternA.occurrenceCount).toBe(5);
    expect(patternA.successRate).toBe(0.8);

    const patternB = report.successPatterns.find(
      (p: { patternSteps: string[] }) =>
        p.patternSteps[0] === "initial_contact" &&
        p.patternSteps[1] === "document_send" &&
        p.patternSteps[2] === "closing"
    );

    expect(patternB).toBeDefined();
    expect(patternB.transitionStepCount).toBe(3);
    expect(patternB.occurrenceCount).toBe(3);
    expect(patternB.successRate).toBe(1.0);

    expect(report.analysisStartDate).toBe("2024-01-01");
    expect(report.analysisEndDate).toBe("2024-03-31");
    expect(report.salesRepId).toBe("A001");
  });
});