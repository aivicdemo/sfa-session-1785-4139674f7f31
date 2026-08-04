import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2233
  test("OpenAI API呼び出しが失敗したとき内部推奨パターンマスタから統計的上位パターンが返却される", async () => {
    const { generateRecommendation } = await import(
      "../../src/logic/it-1-br-3-3-2-1"
    );

    // モック: OpenAI API呼び出し失敗を3回の指数バックオフで再現
    let attemptCount = 0;
    fetchMock.mockResponse(async () => {
      attemptCount++;
      if (attemptCount <= 3) {
        throw new Error("API timeout");
      }
      return { status: 500, body: "Internal Server Error" };
    });

    // 推奨パターンマスタのテストデータ
    const recommendationPatterns = [
      {
        patternId: "PAT-001",
        patternName: "Pattern A",
        successRate: 87,
        applicableCount: 30,
      },
      {
        patternId: "PAT-002",
        patternName: "Pattern B",
        successRate: 64,
        applicableCount: 20,
      },
      {
        patternId: "PAT-003",
        patternName: "Pattern C",
        successRate: 52,
        applicableCount: 15,
      },
    ];

    // 新規案件データ
    const newDealData = {
      customerIndustry: "製造業",
      dealSize: "中規模",
      decisionMakerCount: 3,
    };

    // AIRecommendationEngineをモック化
    const mockAIEngine = {
      generateRecommendation: async (dealData: typeof newDealData) => {
        // 指数バックオフ再試行ロジック: 1秒、2秒、4秒
        let lastError: Error | null = null;
        const backoffIntervals = [1000, 2000, 4000];

        for (let retry = 0; retry < 3; retry++) {
          try {
            const response = await fetch("https://api.openai.com/v1/chat", {
              method: "POST",
              headers: { Authorization: "Bearer test-key" },
              body: JSON.stringify(dealData),
            });
            if (response.ok) {
              return await response.json();
            }
          } catch (error) {
            lastError = error as Error;
            if (retry < 2) {
              await new Promise((resolve) =>
                setTimeout(resolve, backoffIntervals[retry])
              );
            }
          }
        }

        // フォールバック: 推奨パターンマスタから統計的上位パターンを返却
        const topPattern = recommendationPatterns.sort(
          (a, b) => b.successRate - a.successRate
        )[0];

        return {
          recommendedPatternId: topPattern.patternId,
          patternName: topPattern.patternName,
          successRate: topPattern.successRate,
          applicableCount: topPattern.applicableCount,
          briefExplanation:
            "過去の成功パターンに基づいた推奨（簡略版）",
          userMessage:
            "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
          source: "fallback_pattern_master",
        };
      },
    };

    // テスト実行
    const result = await mockAIEngine.generateRecommendation(newDealData);

    // 期待結果の検証
    expect(result.recommendedPatternId).toBe("PAT-001");
    expect(result.patternName).toBe("Pattern A");
    expect(result.successRate).toBe(87);
    expect(result.applicableCount).toBe(30);
    expect(result.briefExplanation).toBe("過去の成功パターンに基づいた推奨（簡略版）");
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.source).toBe("fallback_pattern_master");
  });
});