import { generatePersuasiveDocument } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料生成", () => {
  // SCEN-2024
  test("提案妥当性スコアが100のとき、妥当性セクションが最高評価で表示される", () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(() => 100),
    };

    const customerInfo = {
      companyName: "Sample Corporation",
      industry: "Manufacturing",
      scale: "Large",
      businessChallenge: "Supply chain optimization",
    };

    const proposalContent = {
      title: "Integrated Supply Chain Solution",
      description: "End-to-end supply chain digitalization",
      expectedROI: 45,
      implementationPeriod: 6,
    };

    const analysisResult = {
      proposalValidity: 100,
      customerConstraints: {
        budget: 5000000,
        timeline: "Q3-Q4 2024",
        technicalRequirements: ["Cloud", "Real-time", "Analytics"],
      },
      riskFactors: [],
      improvementSuggestions: [],
    };

    // Act
    const result = generatePersuasiveDocument(
      customerInfo,
      proposalContent,
      analysisResult,
      mockAIEngine
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.document).toBeDefined();
    expect(result.document.validitySection).toBeDefined();

    const validitySection = result.document.validitySection;
    expect(validitySection.scoreValue).toBe(100);
    expect(validitySection.evaluationLevel).toBe("A+");
    expect(validitySection.ratingStars).toBe(5);
    expect(validitySection.applicabilityText).toBe("極めて高い");
    expect(validitySection.displayColor).toBe("highest");

    expect(validitySection.label).toMatch(/提案妥当性/);
    expect(validitySection.scoreDisplay).toMatch(/100\/100/);
    expect(validitySection.evaluationDescription).toMatch(/最高評価/);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalContent,
      customerInfo
    );
  });
});