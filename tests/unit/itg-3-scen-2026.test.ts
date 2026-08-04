import { generatePersuasionMaterials } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2026
  test("経営層向け説得資料の自動生成機能 - 顧客ニーズマッチスコアが欠落しているとき、その項目の寄与を0として計算される", () => {
    // Arrange
    const proposalFeasibilityInput = {
      roiContribution: 0.3,
      implementationDifficultyScore: 0.25,
      competitiveResponseDegree: 0.2,
      customerNeedsMatchScore: null,
    };

    const weights = {
      roi: 0.4,
      implementationDifficulty: 0.3,
      competitiveResponse: 0.2,
      customerNeedsMatch: 0.1,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalContent: "提案内容",
        proposalFeasibility: proposalFeasibilityInput,
        weights: weights,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileUrl: "https://example.com/report.pdf",
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const proposalData = {
      customerId: "CUST-001",
      proposalTitle: "経営効率化提案",
      proposalDescription: "システム導入による業務改善",
    };

    // Act
    const result = generatePersuasionMaterials(
      proposalData,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    // Assert
    const expectedCompositeScore =
      0.3 * 0.4 + 0.25 * 0.3 + 0.2 * 0.2 + 0 * 0.1;

    expect(result).toHaveProperty("proposalFeasibilityScore");
    expect(result.proposalFeasibilityScore).toBe(0.245);

    expect(result).toHaveProperty("calculationBasis");
    expect(result.calculationBasis).toContain(
      "顧客ニーズマッチスコアは提供されていないため、その寄与度を0として計算されています"
    );

    expect(result).toHaveProperty("trustworthinessWarning");
    expect(result.trustworthinessWarning).toContain(
      "入力項目の不完全性: 顧客ニーズマッチスコアが欠落しているため、実際の提案妥当性はこの値より高い可能性があります"
    );

    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalled();
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalled();

    const uploadCall = fileStorageAdapterStub.uploadRecommendationReport.mock
      .calls[0][0];
    expect(uploadCall).toHaveProperty("proposalFeasibilityScore", 0.245);
    expect(uploadCall.content).toContain(
      "顧客ニーズマッチスコアは提供されていないため、その寄与度を0として計算されています"
    );
  });
});