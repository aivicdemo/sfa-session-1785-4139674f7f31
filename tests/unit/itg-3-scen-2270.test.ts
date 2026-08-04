import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - AIRecommendationEngineのタイムアウト処理", () => {
  // SCEN-2270
  test("AIRecommendationEngineの30秒タイムアウト超過時、代替処理で統計的上位3件の成功パターンを返却する", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("API timeout after 30 seconds"));
            }, 30000);
          })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: "PAT-001",
        successRate: 92,
        applicableCompanyScale: "large",
        industry: "manufacturing",
        templateExplanation: "大規模製造業向けソフトウェア提案パターン",
      },
      {
        patternId: "PAT-002",
        successRate: 88,
        applicableCompanyScale: "medium",
        industry: "finance",
        templateExplanation: "中規模金融向けERPシステム提案パターン",
      },
      {
        patternId: "PAT-003",
        successRate: 85,
        applicableCompanyScale: "medium",
        industry: "retail",
        templateExplanation: "中規模小売向けPOS連携ソリューション",
      },
    ];

    const newProjectData = {
      customerName: "テスト太郎",
      productCategory: "software",
      budget: 5000000,
    };

    const result = await generateRecommendation(
      newProjectData,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.fallbackFlag).toBe(true);
    expect(result.errorMessage).toBeNull();
    expect(result.statusCode).toBe(200);
    expect(result.patterns).toHaveLength(3);

    expect(result.patterns[0]).toEqual({
      patternId: "PAT-001",
      successRate: 92,
      applicableCompanyScale: "large",
      industry: "manufacturing",
    });

    expect(result.patterns[1]).toEqual({
      patternId: "PAT-002",
      successRate: 88,
      applicableCompanyScale: "medium",
      industry: "finance",
    });

    expect(result.patterns[2]).toEqual({
      patternId: "PAT-003",
      successRate: 85,
      applicableCompanyScale: "medium",
      industry: "retail",
    });

    expect(result.briefExplanation).toBeDefined();
    expect(result.briefExplanation.length).toBeLessThanOrEqual(50);
    expect(result.briefExplanation).toMatch(/テンプレート|過去推奨/);

    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    expect(result.recommendation).toBeDefined();
    expect(typeof result.recommendation).toBe("object");
  });
});