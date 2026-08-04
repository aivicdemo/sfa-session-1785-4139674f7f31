import { extractImprovementItems } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善対象項目抽出機能", () => {
  test("SCEN-474: 複数エラータイプが混在する場合、全タイプが改善対象に含まれる", () => {
    // Arrange
    const multiErrorAnalysisResult = {
      dealId: "DEAL-20240115-001",
      dealData: {
        customerId: "CUST-5001",
        dealName: "大手製造業A社 ERP導入案件",
        dealStage: "提案中",
        proposalContent: "既製品提案のみで顧客要件を十分にカバーしていない",
        customerNeedsUnderstanding: "顧客の経営課題の把握が不十分",
        followUpTiming: "前回接触から45日以上経過、対応遅延",
      },
      errorTypes: [
        {
          type: "PROPOSAL_INADEQUACY",
          typeId: "ERR_TYPE_A",
          description: "提案内容の不適切さ - 顧客要件との適合度が50%未満",
          severity: "HIGH",
        },
        {
          type: "NEEDS_UNDERSTANDING_DEFICIT",
          typeId: "ERR_TYPE_B",
          description:
            "顧客ニーズ把握不足 - ヒアリング項目の網羅度が60%未満",
          severity: "MEDIUM",
        },
        {
          type: "FOLLOWUP_DELAY",
          typeId: "ERR_TYPE_C",
          description: "フォローアップ対応の遅延 - 推奨タイミングから14日以上超過",
          severity: "HIGH",
        },
      ],
      analysisTimestamp: "2024-01-15T10:00:00Z",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act
    const improvementItems = extractImprovementItems(
      multiErrorAnalysisResult,
      mockAIEngine
    );

    // Assert
    expect(improvementItems).toHaveLength(3);

    // ERR_TYPE_A の検証
    const itemTypeA = improvementItems.find(
      (item) => item.errorTypeId === "ERR_TYPE_A"
    );
    expect(itemTypeA).toBeDefined();
    expect(itemTypeA?.errorType).toBe("PROPOSAL_INADEQUACY");
    expect(itemTypeA?.description).toContain("提案内容の不適切さ");
    expect(itemTypeA?.severity).toBe("HIGH");

    // ERR_TYPE_B の検証
    const itemTypeB = improvementItems.find(
      (item) => item.errorTypeId === "ERR_TYPE_B"
    );
    expect(itemTypeB).toBeDefined();
    expect(itemTypeB?.errorType).toBe("NEEDS_UNDERSTANDING_DEFICIT");
    expect(itemTypeB?.description).toContain("顧客ニーズ把握不足");
    expect(itemTypeB?.severity).toBe("MEDIUM");

    // ERR_TYPE_C の検証
    const itemTypeC = improvementItems.find(
      (item) => item.errorTypeId === "ERR_TYPE_C"
    );
    expect(itemTypeC).toBeDefined();
    expect(itemTypeC?.errorType).toBe("FOLLOWUP_DELAY");
    expect(itemTypeC?.description).toContain("フォローアップ対応の遅延");
    expect(itemTypeC?.severity).toBe("HIGH");

    // すべてのエラータイプが個別項目として抽出されていることを確認
    const extractedTypeIds = improvementItems.map((item) => item.errorTypeId);
    expect(extractedTypeIds).toContain("ERR_TYPE_A");
    expect(extractedTypeIds).toContain("ERR_TYPE_B");
    expect(extractedTypeIds).toContain("ERR_TYPE_C");
  });
});