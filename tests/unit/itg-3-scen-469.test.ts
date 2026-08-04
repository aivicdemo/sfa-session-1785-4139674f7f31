import { generateRecommendationByItems } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導施策推奨機能", () => {
  // SCEN-469: [normal] 指導施策推奨機能 - 複数の改善対象項目がある場合、項目ごとの具体的施策が推奨される
  test("should generate item-specific recommendations for multiple improvement items", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            improvementItem: "コスト削減",
            proposedMeasure: "資材仕入れ先の一括化",
            rationale:
              "複数の仕入先を統一することで、取引量の増加に伴う仕入値引率向上と、発注・管理業務の効率化を実現。",
            confidenceScore: 85,
          },
          {
            improvementItem: "納期短縮",
            proposedMeasure: "生産工程の並列化",
            rationale:
              "従来の直列工程を部分的に並列化することで、全工程所要時間を削減。製造業の納期競争力を強化。",
            confidenceScore: 78,
          },
          {
            improvementItem: "品質向上",
            proposedMeasure: "検査体制の強化",
            rationale:
              "多段階検査の導入と自動化検査システムの活用により、不良品率を低減し顧客満足度を向上。",
            confidenceScore: 82,
          },
        ],
      }),
    };

    const inputConditions = {
      customerIndustry: "製造業",
      improvementItems: ["コスト削減", "納期短縮", "品質向上"],
      customerSize: "大企業",
      dealStage: "初期相談",
    };

    const result = await generateRecommendationByItems(
      inputConditions,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      inputConditions
    );
    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0]).toEqual({
      improvementItem: "コスト削減",
      proposedMeasure: "資材仕入れ先の一括化",
      rationale:
        "複数の仕入先を統一することで、取引量の増加に伴う仕入値引率向上と、発注・管理業務の効率化を実現。",
      confidenceScore: 85,
    });
    expect(result.recommendations[1]).toEqual({
      improvementItem: "納期短縮",
      proposedMeasure: "生産工程の並列化",
      rationale:
        "従来の直列工程を部分的に並列化することで、全工程所要時間を削減。製造業の納期競争力を強化。",
      confidenceScore: 78,
    });
    expect(result.recommendations[2]).toEqual({
      improvementItem: "品質向上",
      proposedMeasure: "検査体制の強化",
      rationale:
        "多段階検査の導入と自動化検査システムの活用により、不良品率を低減し顧客満足度を向上。",
      confidenceScore: 82,
    });
  });
});