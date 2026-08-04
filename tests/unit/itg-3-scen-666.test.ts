import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・推奨機能", () => {
  // SCEN-666
  test("過去商談データが0件かつOpenAI API呼び出しが失敗した場合、内部推奨パターンマスタから統計的に上位の成功パターンを返却する", async () => {
    // Arrange: OpenAI API呼び出し失敗をシミュレート（30秒以上のタイムアウト）
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("API timeout exceeded 30 seconds"));
          }, 31000);
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件情報
    const newDealInput = {
      customerIndustry: "製造業",
      budgetScaleYen: 50000000,
      decisionMakersCount: 3,
      pastDealsCount: 0,
    };

    // 期待される内部推奨パターンマスタからの応答
    // 統計的上位パターン（成功率降順、適用実績数が多い順）
    const expectedPatterns = [
      {
        patternId: "PAT-001",
        patternName: "大規模製造業向け統合提案",
        successRatePercent: 78,
        pastApplicationCount: 42,
        abbreviatedReason: "内部統計に基づく推奨",
      },
      {
        patternId: "PAT-005",
        patternName: "複数部門展開型提案",
        successRatePercent: 72,
        pastApplicationCount: 38,
        abbreviatedReason: "内部統計に基づく推奨",
      },
      {
        patternId: "PAT-012",
        patternName: "経営層同意形成アプローチ",
        successRatePercent: 68,
        pastApplicationCount: 35,
        abbreviatedReason: "内部統計に基づく推奨",
      },
      {
        patternId: "PAT-008",
        patternName: "段階的導入パターン",
        successRatePercent: 65,
        pastApplicationCount: 28,
        abbreviatedReason: "内部統計に基づく推奨",
      },
    ];

    // Act: generateRecommendationを呼び出す（AIエンジンが失敗する前提）
    const result = await generateRecommendation(
      newDealInput,
      aiEngineStub,
      0 // pastDealsCount = 0
    );

    // Assert
    // 1. 返却されたパターンが統計的上位3～5件であることを確認
    expect(result.recommendedPatterns).toHaveLength(4);

    // 2. 各パターンが必須フィールドを含んでいることを確認
    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern).toHaveProperty("patternId");
      expect(pattern).toHaveProperty("patternName");
      expect(pattern).toHaveProperty("successRatePercent");
      expect(pattern).toHaveProperty("pastApplicationCount");
      expect(pattern).toHaveProperty("abbreviatedReason");
    });

    // 3. 成功率の降順でソート済みであることを確認
    expect(result.recommendedPatterns[0].successRatePercent).toBe(78);
    expect(result.recommendedPatterns[1].successRatePercent).toBe(72);
    expect(result.recommendedPatterns[2].successRatePercent).toBe(68);
    expect(result.recommendedPatterns[3].successRatePercent).toBe(65);

    // 4. パターンが完全に一致していることを確認
    expect(result.recommendedPatterns).toEqual(expectedPatterns);

    // 5. 簡略版根拠が定型文であることを確認
    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.abbreviatedReason).toMatch(/内部統計に基づく推奨/);
    });

    // 6. 利用者向けメッセージが含まれていることを確認
    expect(result.userMessage).toMatch(/推奨の生成に一時的な遅延が発生しています/);
    expect(result.userMessage).toMatch(/過去の推奨履歴から類似案件を表示します/);

    // 7. AIエンジンが最大3回の指数バックオフで再試行されたことを確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // 8. フォールバック動作が有効であることを確認
    expect(result.isFallbackMode).toBe(true);
  });
});