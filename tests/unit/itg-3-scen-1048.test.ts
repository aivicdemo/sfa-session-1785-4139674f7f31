import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件への提案アプローチを自動推奨する", () => {
  // SCEN-1048
  test("過去成功パターン抽出・新規案件への適用推奨機能 - 過去商談データから複数件の成功パターンを抽出し、すべてが新規案件と照合される", () => {
    // 過去商談データベースの成功事例
    const pastSuccessPatterns = [
      {
        id: "pattern_001",
        industry: "製造",
        companySize: "中堅",
        challenge: "生産効率化",
        proposalContent: "自動化ツール導入",
        closureRate: 0.85,
      },
      {
        id: "pattern_002",
        industry: "製造",
        companySize: "中堅",
        challenge: "コスト削減",
        proposalContent: "プロセス最適化",
        closureRate: 0.78,
      },
      {
        id: "pattern_003",
        industry: "流通",
        companySize: "大企業",
        challenge: "在庫管理",
        proposalContent: "システム導入",
        closureRate: 0.7,
      },
    ];

    // 新規案件データ
    const newDealData = {
      industry: "製造",
      companySize: "中堅",
      challenges: ["生産効率化", "コスト削減"],
      budgetAmount: 5000000,
    };

    // AIRecommendationEngine スタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((deal) => {
        return [
          { patternId: "pattern_001", similarityScore: 0.92 },
          { patternId: "pattern_002", similarityScore: 0.88 },
          { patternId: "pattern_003", similarityScore: 0.45 },
        ];
      }),
      evaluatePatternRelevance: jest.fn((deal, patternId) => {
        const relevanceMap: { [key: string]: number } = {
          pattern_001: 0.89,
          pattern_002: 0.85,
          pattern_003: 0.52,
        };
        return relevanceMap[patternId] || 0;
      }),
      generateRecommendation: jest.fn((deal, patterns) => {
        return {
          recommendedPatterns: patterns,
          confidenceScore: 0.87,
          generatedAt: "2024-01-15T11:00:00Z",
        };
      }),
    };

    // generateRecommendation 関数を呼び出す
    const result = generateRecommendation(newDealData, mockAIEngine);

    // 推奨結果の検証
    expect(result).toBeDefined();
    expect(result.recommendedPatterns).toBeDefined();
    expect(Array.isArray(result.recommendedPatterns)).toBe(true);

    // 適用可能性スコアが0.80以上の事例が全て候補として抽出されることを確認
    const candidatePatterns = result.recommendedPatterns.filter(
      (pattern: { relevanceScore: number }) => pattern.relevanceScore >= 0.8
    );
    expect(candidatePatterns.length).toBe(2);

    // 事例1と事例2が候補として含まれることを確認
    const patternIds = result.recommendedPatterns.map(
      (p: { patternId: string }) => p.patternId
    );
    expect(patternIds).toContain("pattern_001");
    expect(patternIds).toContain("pattern_002");
    expect(patternIds).not.toContain("pattern_003");

    // ランク付け順序の検証（適用可能性スコアが高い順）
    expect(result.recommendedPatterns[0].relevanceScore).toBe(0.89);
    expect(result.recommendedPatterns[1].relevanceScore).toBe(0.85);

    // 各パターンに照合根拠が含まれることを確認
    result.recommendedPatterns.forEach((pattern: any) => {
      expect(pattern.similarityScore).toBeDefined();
      expect(pattern.relevanceScore).toBeDefined();
      expect(pattern.closureRate).toBeDefined();
      expect(typeof pattern.similarityScore).toBe("number");
      expect(typeof pattern.relevanceScore).toBe("number");
      expect(typeof pattern.closureRate).toBe("number");
    });

    // 具体的な値の確認
    const pattern1 = result.recommendedPatterns.find(
      (p: { patternId: string }) => p.patternId === "pattern_001"
    );
    expect(pattern1.similarityScore).toBe(0.92);
    expect(pattern1.relevanceScore).toBe(0.89);
    expect(pattern1.closureRate).toBe(0.85);

    const pattern2 = result.recommendedPatterns.find(
      (p: { patternId: string }) => p.patternId === "pattern_002"
    );
    expect(pattern2.similarityScore).toBe(0.88);
    expect(pattern2.relevanceScore).toBe(0.85);
    expect(pattern2.closureRate).toBe(0.78);
  });
});