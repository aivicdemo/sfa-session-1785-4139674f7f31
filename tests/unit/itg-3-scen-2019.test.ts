import { generateExecutivePersuasionMaterial } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2019
  test("[edge] 経営層向け説得資料の自動生成機能 - リスク要因リストが複数件のとき、全件が優先度順にリスク列に記載される", () => {
    // テストデータ: 5件のリスク要因を準備（優先度: 5, 3, 1, 4, 2）
    const riskFactors = [
      {
        id: "risk_1",
        name: "リスク1",
        priority: 5,
        description: "低優先度のリスク要因1",
        evidence: "過去事例での発生率10%",
      },
      {
        id: "risk_2",
        name: "リスク2",
        priority: 3,
        description: "中優先度のリスク要因2",
        evidence: "競合事例での発生率30%",
      },
      {
        id: "risk_3",
        name: "リスク3",
        priority: 1,
        description: "高優先度のリスク要因3",
        evidence: "類似顧客での発生率80%",
      },
      {
        id: "risk_4",
        name: "リスク4",
        priority: 4,
        description: "低中優先度のリスク要因4",
        evidence: "業界レポートでの指摘率25%",
      },
      {
        id: "risk_5",
        name: "リスク5",
        priority: 2,
        description: "高中優先度のリスク要因5",
        evidence: "顧客ヒアリングでの懸念率60%",
      },
    ];

    // AIRecommendationEngineのスタブ設定
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_001",
        proposalApproach: "標準化された提案アプローチ",
        confidenceScore: 85,
        riskFactors: riskFactors,
        successPatterns: [
          {
            patternId: "sp_001",
            description: "成功パターン1",
            applicability: 90,
          },
        ],
        improvementSuggestions: ["改善提案1", "改善提案2"],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: "推奨の根拠説明",
      }),
    };

    // 顧客情報と提案内容の入力パラメータ
    const customerInfo = {
      industry: "製造業",
      scale: "大企業",
      challenges: ["生産性向上", "コスト削減"],
    };

    const proposalContent = {
      proposalId: "prop_001",
      products: ["Product A", "Product B"],
      estimatedInvestment: 5000000,
      expectedROI: 2.5,
      implementationPeriod: 12,
    };

    // 経営層向け説得資料の自動生成機能を実行
    const result = generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      aiEngineStub
    );

    // 生成された説得資料からリスク列を抽出
    expect(result).toBeDefined();
    expect(result.riskFactors).toBeDefined();
    expect(Array.isArray(result.riskFactors)).toBe(true);
    expect(result.riskFactors.length).toBe(5);

    // リスク要因が優先度の高い順（1→2→3→4→5）で記載されていることを検証
    expect(result.riskFactors[0].priority).toBe(1);
    expect(result.riskFactors[0].name).toBe("リスク3");
    expect(result.riskFactors[0].description).toBe(
      "高優先度のリスク要因3"
    );
    expect(result.riskFactors[0].evidence).toBe("類似顧客での発生率80%");

    expect(result.riskFactors[1].priority).toBe(2);
    expect(result.riskFactors[1].name).toBe("リスク5");
    expect(result.riskFactors[1].description).toBe(
      "高中優先度のリスク要因5"
    );
    expect(result.riskFactors[1].evidence).toBe("顧客ヒアリングでの懸念率60%");

    expect(result.riskFactors[2].priority).toBe(3);
    expect(result.riskFactors[2].name).toBe("リスク2");
    expect(result.riskFactors[2].description).toBe(
      "中優先度のリスク要因2"
    );
    expect(result.riskFactors[2].evidence).toBe("競合事例での発生率30%");

    expect(result.riskFactors[3].priority).toBe(4);
    expect(result.riskFactors[3].name).toBe("リスク4");
    expect(result.riskFactors[3].description).toBe(
      "低中優先度のリスク要因4"
    );
    expect(result.riskFactors[3].evidence).toBe("業界レポートでの指摘率25%");

    expect(result.riskFactors[4].priority).toBe(5);
    expect(result.riskFactors[4].name).toBe("リスク1");
    expect(result.riskFactors[4].description).toBe(
      "低優先度のリスク要因1"
    );
    expect(result.riskFactors[4].evidence).toBe("過去事例での発生率10%");

    // 説得資料全体の構造検証
    expect(result.proposalValidation).toBeDefined();
    expect(result.investmentJustification).toBeDefined();
    expect(result.recommendedActions).toBeDefined();
  });
});