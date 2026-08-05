import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-982: [error] 成功要因・失敗要因の抽出と承認判定機能 - 言語化された成功要因がすべて承認基準を満たさないとき、テンプレート設計への進行がブロックされる
  test("成功要因がすべて承認基準を満たさないとき、テンプレート設計フェーズへの遷移がブロックされる", async () => {
    // Arrange
    const { validateSuccessFactorsForTemplateDesign } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const salesCaseId = "CASE-20240115-001";
    const successFactors = [
      {
        factorId: "SF-001",
        description: "顧客の予算承認が得られた",
        approvalScore: 65,
      },
      {
        factorId: "SF-002",
        description: "営業担当者の提案資料が高品質",
        approvalScore: 75,
      },
      {
        factorId: "SF-003",
        description: "競合他社との価格差別化ができた",
        approvalScore: 70,
      },
    ];

    const approvalCriteria = {
      "顧客の予算承認が得られた": { minScore: 70, status: "failed" },
      "営業担当者の提案資料が高品質": { minScore: 80, status: "failed" },
      "競合他社との価格差別化ができた": { minScore: 75, status: "failed" },
    };

    const evaluationResults = [
      {
        factorId: "SF-001",
        description: "顧客の予算承認が得られた",
        approvalStatus: "不合格",
        reason: "基準値70未満",
      },
      {
        factorId: "SF-002",
        description: "営業担当者の提案資料が高品質",
        approvalStatus: "不合格",
        reason: "基準値80未満",
      },
      {
        factorId: "SF-003",
        description: "競合他社との価格差別化ができた",
        approvalStatus: "不合格",
        reason: "基準値75未満",
      },
    ];

    const input = {
      salesCaseId: salesCaseId,
      successFactors: successFactors,
      approvalCriteria: approvalCriteria,
      evaluationResults: evaluationResults,
      requestTransitionToTemplateDesign: true,
    };

    // Act & Assert
    expect(() => {
      validateSuccessFactorsForTemplateDesign(input);
    }).toThrow(/承認基準/);
  });
});