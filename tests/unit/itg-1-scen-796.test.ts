import { analyzeMultipleStandardProcessDeviations } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者行動パターン分析レポート生成機能", () => {
  // SCEN-796
  test("営業プロセス標準書が複数件のとき、全件を参照して乖離度を分析する", () => {
    const standardProcesses = [
      {
        standardProcessId: "STD-001",
        processSteps: ["初期接触", "提案", "クロージング"],
        stepSequence: [
          { order: 1, step: "初期接触", expectedDuration: 30 },
          { order: 2, step: "提案", expectedDuration: 60 },
          { order: 3, step: "クロージング", expectedDuration: 45 },
        ],
      },
      {
        standardProcessId: "STD-002",
        processSteps: ["ニーズ把握", "見積提示", "契約"],
        stepSequence: [
          { order: 1, step: "ニーズ把握", expectedDuration: 50 },
          { order: 2, step: "見積提示", expectedDuration: 40 },
          { order: 3, step: "契約", expectedDuration: 30 },
        ],
      },
      {
        standardProcessId: "STD-003",
        processSteps: ["顧客分析", "カスタマイズ提案", "導入支援"],
        stepSequence: [
          { order: 1, step: "顧客分析", expectedDuration: 60 },
          { order: 2, step: "カスタマイズ提案", expectedDuration: 80 },
          { order: 3, step: "導入支援", expectedDuration: 100 },
        ],
      },
    ];

    const salesRepresentativeActualBehaviorLog = {
      salesRepresentativeId: "REP-A",
      actions: [
        {
          actionType: "初期接触",
          occurredAt: new Date("2024-01-15T09:00:00Z"),
          durationMinutes: 32,
        },
        {
          actionType: "提案",
          occurredAt: new Date("2024-01-15T10:00:00Z"),
          durationMinutes: 58,
        },
        {
          actionType: "クロージング",
          occurredAt: new Date("2024-01-15T11:00:00Z"),
          durationMinutes: 50,
        },
        {
          actionType: "ニーズ把握",
          occurredAt: new Date("2024-01-16T09:00:00Z"),
          durationMinutes: 48,
        },
        {
          actionType: "見積提示",
          occurredAt: new Date("2024-01-16T10:00:00Z"),
          durationMinutes: 42,
        },
        {
          actionType: "契約",
          occurredAt: new Date("2024-01-16T11:00:00Z"),
          durationMinutes: 28,
        },
        {
          actionType: "顧客分析",
          occurredAt: new Date("2024-01-17T09:00:00Z"),
          durationMinutes: 65,
        },
        {
          actionType: "カスタマイズ提案",
          occurredAt: new Date("2024-01-17T10:00:00Z"),
          durationMinutes: 90,
        },
        {
          actionType: "導入支援",
          occurredAt: new Date("2024-01-17T11:00:00Z"),
          durationMinutes: 105,
        },
      ],
    };

    const analysisResult = analyzeMultipleStandardProcessDeviations(
      standardProcesses,
      salesRepresentativeActualBehaviorLog
    );

    expect(analysisResult.analyzedStandardProcesses).toHaveLength(3);

    const result001 = analysisResult.analyzedStandardProcesses.find(
      (r) => r.standardProcessId === "STD-001"
    );
    expect(result001).toBeDefined();
    expect(result001?.deviationScore).toBe(4.2);

    const result002 = analysisResult.analyzedStandardProcesses.find(
      (r) => r.standardProcessId === "STD-002"
    );
    expect(result002).toBeDefined();
    expect(result002?.deviationScore).toBe(3.8);

    const result003 = analysisResult.analyzedStandardProcesses.find(
      (r) => r.standardProcessId === "STD-003"
    );
    expect(result003).toBeDefined();
    expect(result003?.deviationScore).toBe(5.6);

    const rankedResults = analysisResult.analyzedStandardProcesses.sort(
      (a, b) => a.rank - b.rank
    );
    expect(rankedResults[0].standardProcessId).toBe("STD-002");
    expect(rankedResults[0].rank).toBe(1);
    expect(rankedResults[1].standardProcessId).toBe("STD-001");
    expect(rankedResults[1].rank).toBe(2);
    expect(rankedResults[2].standardProcessId).toBe("STD-003");
    expect(rankedResults[2].rank).toBe(3);
  });
});