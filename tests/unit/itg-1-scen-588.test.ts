import {
  detectProblemAndJudgeSeverity,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-588: [normal] 問題検出結果の重要度・対応必要性判定機能 - 判定根拠が記録フィールドに正しく格納される
  test("should correctly record judgment basis in detection result fields when processing unapproved deal with 5M yen amount", () => {
    const problemDetectionInput = {
      violationType: "未承認案件",
      salesStage: "提案段階",
      dealAmount: 5000000,
      dealId: "DEAL-20240115-001",
      salesPersonId: "SP-001",
      customerName: "テスト顧客",
      proposalDate: "2024-01-15T10:00:00Z",
    };

    const result = detectProblemAndJudgeSeverity(problemDetectionInput);

    expect(result).toEqual({
      problemDetected: true,
      judgmentReasonType: "未承認案件×500万円以上",
      severity: "高",
      actionRequired: "必須",
      judgmentTimestamp: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      ),
      traceabilityLog: {
        violationType: "未承認案件",
        salesStage: "提案段階",
        dealAmount: 5000000,
        dealId: "DEAL-20240115-001",
        salesPersonId: "SP-001",
        customerName: "テスト顧客",
        proposalDate: "2024-01-15T10:00:00Z",
      },
    });

    expect(result.severity).toBe("高");
    expect(result.actionRequired).toBe("必須");
    expect(result.judgmentReasonType).toBe("未承認案件×500万円以上");
    expect(result.problemDetected).toBe(true);

    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    expect(result.judgmentTimestamp).toMatch(timestampRegex);

    expect(result.traceabilityLog.violationType).toBe("未承認案件");
    expect(result.traceabilityLog.salesStage).toBe("提案段階");
    expect(result.traceabilityLog.dealAmount).toBe(5000000);
    expect(result.traceabilityLog.dealId).toBe("DEAL-20240115-001");
    expect(result.traceabilityLog.salesPersonId).toBe("SP-001");
    expect(result.traceabilityLog.customerName).toBe("テスト顧客");
    expect(result.traceabilityLog.proposalDate).toBe("2024-01-15T10:00:00Z");
  });
});