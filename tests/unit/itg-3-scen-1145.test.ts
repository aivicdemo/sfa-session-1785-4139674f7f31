import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1145
  test("AIエージェントが正常応答したとき、営業担当者向けの自然言語説明文を生成する", () => {
    // Arrange: モック AIRecommendationEngine の stub
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "導入前のコンサルティングフェーズを設定",
        successPatterns: [
          {
            industryType: "IT",
            companySize: "1000-5000名",
            approachName: "事前コンサルティング",
            conversionRate: 78,
            similarityScore: 0.85,
          },
        ],
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          "IT業界の1000-5000名規模企業との過去商談で、事前コンサルティングという提案アプローチを採用した際の成約率は78%でした。貴社の案件も同じ条件に合致しているため（類似度スコア85点）、同じアプローチを推奨します。具体的には、導入前のコンサルティングフェーズを重視することで、顧客の業務効率化課題を効果的に解決できます。"
        ),
    };

    const customerInfo = {
      industry: "IT",
      companySize: "1000-5000名",
      dealStage: "discovery",
      dealId: "DEAL-20240115-001",
    };

    const expectedExplanationStructure = {
      hasIndustryReference: true,
      hasCompanySizeReference: true,
      hasPastCaseCharacteristics: true,
      hasSimilarityPoints: true,
      hasConversionRateMetric: true,
      hasRecommendationReason: true,
      hasApplicabilityProposal: true,
      hasMultipleEvidences: true,
    };

    // Act
    const result = explainRecommendationReasoning(
      customerInfo,
      mockAIEngine
    );

    // Assert
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");

    // 返却された説明文が必須要素を含むことを検証
    expect(result.explanation).toContain("IT業界");
    expect(result.explanation).toContain("1000-5000名");
    expect(result.explanation).toContain("78");
    expect(result.explanation).toContain("85");
    expect(result.explanation).toContain("事前コンサルティング");
    expect(result.explanation).toContain("導入前のコンサルティングフェーズ");
    expect(result.explanation).toContain("業務効率化課題");

    // 成約率などの数値根拠が含まれていることを確認
    expect(result.explanation).toMatch(/78%/);
    expect(result.explanation).toMatch(/85/);

    // 過去事例根拠が1件以上含まれていることを確認
    expect(result.pastCaseReferences).toBeDefined();
    expect(Array.isArray(result.pastCaseReferences)).toBe(true);
    expect(result.pastCaseReferences.length).toBeGreaterThanOrEqual(1);

    // 過去事例の構造が正しいことを確認
    expect(result.pastCaseReferences[0]).toMatchObject({
      industryType: expect.any(String),
      companySize: expect.any(String),
      approachName: expect.any(String),
      conversionRate: expect.any(Number),
      similarityScore: expect.any(Number),
    });

    // 具体的な数値検証
    expect(result.pastCaseReferences[0].conversionRate).toBe(78);
    expect(result.pastCaseReferences[0].similarityScore).toBe(0.85);

    // 説明文が営業担当者向けの日本語表現を含むことを確認
    expect(result.explanation).toMatch(/推奨します/);
    expect(result.explanation).toMatch(/過去商談/);
    expect(result.explanation).toMatch(/効果的/);

    // AIエンジンのメソッドが正しい引数で呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "IT",
        companySize: "1000-5000名",
        dealStage: "discovery",
        dealId: "DEAL-20240115-001",
      }),
      expect.any(Object)
    );

    // 返却結果の形式が期待される構造を持つことを確認
    expect(result).toHaveProperty("explanation");
    expect(result).toHaveProperty("pastCaseReferences");
    expect(result).toHaveProperty("recommendationScore");
    expect(result.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendationScore).toBeLessThanOrEqual(100);
  });
});