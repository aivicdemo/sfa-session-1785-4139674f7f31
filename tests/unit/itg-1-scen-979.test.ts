import { evaluateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-979
  test("営業部長の承認基準定義が空のとき、適合性判定ができずエラーになる", () => {
    const successFactors = [
      {
        factorId: "sf_001",
        name: "顧客との信頼構築",
        description: "初回接触時に顧客の課題ニーズを丁寧にヒアリング",
        frequency: 12,
        successRate: 85,
      },
    ];

    const failureFactors = [
      {
        factorId: "ff_001",
        name: "提案時期の遅延",
        description: "顧客の購買意思決定タイミングを逃した",
        frequency: 5,
        successRate: 0,
      },
    ];

    const approvalCriteriaNullTest = () => {
      evaluateApprovalCriteria({
        successFactors,
        failureFactors,
        approvalCriteria: null,
      });
    };

    expect(approvalCriteriaNullTest).toThrow(/APPROVAL_CRITERIA_NOT_DEFINED/);

    const approvalCriteriaEmptyTest = () => {
      evaluateApprovalCriteria({
        successFactors,
        failureFactors,
        approvalCriteria: "",
      });
    };

    expect(approvalCriteriaEmptyTest).toThrow(/APPROVAL_CRITERIA_NOT_DEFINED/);
  });
});