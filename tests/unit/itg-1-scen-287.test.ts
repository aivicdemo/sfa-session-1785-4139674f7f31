import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-287: [error] 営業担当者行動パターン分析・改善指導判定機能 - 提案内容にデータが存在しても各項目が null のとき、処理が中断される
  test("提案内容が存在するが全フィールドが null の場合、処理を中断してエラーをスロー", () => {
    const { analyzeProposalQualityAndRecommendGuidance } = require(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const proposalWithAllNullFields = {
      id: "proposal_001",
      proposalTitle: null,
      proposalDescription: null,
      proposalAmount: null,
      proposalDateTime: null,
      proposalStatus: null,
      customerSegment: null,
      productCategory: null,
    };

    const externalServiceMock = {
      callCount: 0,
      queryDatabase: function () {
        this.callCount++;
        return {};
      },
      callAnalysisEngine: function () {
        this.callCount++;
        return {};
      },
    };

    expect(() => {
      analyzeProposalQualityAndRecommendGuidance(
        proposalWithAllNullFields,
        externalServiceMock
      );
    }).toThrow(/提案内容|必須項目|不完全/);

    expect(externalServiceMock.callCount).toBe(0);
  });
});