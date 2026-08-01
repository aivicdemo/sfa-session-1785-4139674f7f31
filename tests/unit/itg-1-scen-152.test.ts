import { generateActionPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-152
  test("標準プロセスの4ステップすべてが乖離したとき、乖離パターンが正常に記録される", () => {
    const salesPersonId = "SALES-001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");

    const actionPatternData = {
      salesPersonId,
      activityRecords: [
        {
          stepName: "初回接触",
          plannedDate: new Date("2024-01-05T09:00:00Z"),
          actualDate: new Date("2024-01-08T09:00:00Z"),
          delayDays: 3,
          status: "completed",
          notes: "顧客へのアプローチが予定より3日遅延",
        },
        {
          stepName: "提案",
          customerRequirement: "低コスト・高性能",
          proposalContent: "プレミアム・高機能パッケージ",
          requirementMatch: false,
          status: "completed",
          notes: "顧客要件と異なる内容を提案",
        },
        {
          stepName: "交渉",
          assignedPerson: "SALES-001",
          actualHandler: "SALES-002",
          isAssignedPersonParticipated: false,
          status: "completed",
          notes: "担当者が参加せず代行者が対応",
        },
        {
          stepName: "成約",
          contractSignatureDate: null,
          revenueDateRecorded: new Date("2024-01-20T00:00:00Z"),
          isContractSigned: false,
          status: "completed",
          notes: "契約書署名なしに売上計上",
        },
      ],
    };

    const result = generateActionPatternAnalysisReport(
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      actionPatternData
    );

    expect(result).toEqual({
      salesPersonId: "SALES-001",
      analysisStartDate: "2024-01-01T00:00:00Z",
      analysisEndDate: "2024-01-31T23:59:59Z",
      generatedAt: expect.any(String),
      deviationPatterns: [
        {
          stepName: "初回接触",
          deviationType: "遅延",
          deviationDetail: "遅延3日",
          severity: "medium",
        },
        {
          stepName: "提案",
          deviationType: "不一致",
          deviationDetail: "顧客要件不一致",
          severity: "high",
        },
        {
          stepName: "交渉",
          deviationType: "プロセス逸脱",
          deviationDetail: "担当者不在・代行対応",
          severity: "high",
        },
        {
          stepName: "成約",
          deviationType: "コンプライアンス違反",
          deviationDetail: "契約書未署名",
          severity: "high",
        },
      ],
      deviationStepCount: 4,
      totalStepCount: 4,
      deviationRatio: 1.0,
      deviationLevel: "高",
      summary: {
        allStepsDeviated: true,
        criticalIssuesDetected: 3,
        riskAssessment: "要改善指導",
      },
    });
  });
});