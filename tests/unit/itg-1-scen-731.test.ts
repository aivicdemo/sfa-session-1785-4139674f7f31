import { calculateComplianceScoreWithPracticalApplicationStatus } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-731: [error] 成功パターン適用ガイドラインの周知完了判定機能 - 実務適用状況が空文字列のとき処理がスキップされる
  test("should skip processing and return null when practicalApplicationStatus is empty string", () => {
    const input = {
      employeeId: "EMP001",
      guidanceDocumentId: "GUIDE-2024-001",
      comprehensionScore: 85,
      practicalApplicationStatus: "",
      implementationReportSubmissionDate: new Date("2024-01-20T10:00:00Z"),
    };

    const result = calculateComplianceScoreWithPracticalApplicationStatus(input);

    expect(result).toBeNull();
  });
});