import { evaluatePatternRelevance } from "../../src/logic/itg-3";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨支援システム", () => {
  test("SCEN-456: 改善優先度スコアリング機能 - エラー件数が閾値直下の場合、優先度スコアが正しく算出される", () => {
    fetchMock.resetMocks();

    // テストデータ: エラー件数が閾値直下（閾値100、入力99）
    const testData = {
      errorCount: 99,
      errorThreshold: 100,
      dealAmount: 5000000,
      customerIndustry: "製造業",
      proposalComplexity: 65,
      dealStage: "提案中",
      customerSegment: "大規模顧客",
      createdAt: new Date("2024-01-15T10:00:00Z"),
    };

    // AIRecommendationEngine のスタブレスポンス
    const stubEngineResponse = {
      relevanceScore: 0.82,
      matchedPatterns: [
        {
          patternId: "pat_001",
          matchRate: 0.85,
          successRate: 0.78,
        },
      ],
      applicability: true,
      confidence: 0.88,
    };

    fetchMock.mockResponseOnce(JSON.stringify(stubEngineResponse), {
      status: 200,
    });

    // 改善優先度スコアリング関数を実行
    const result = evaluatePatternRelevance(testData);

    // アサーション: スコアが数値型で範囲内であることを確認
    expect(typeof result.priorityScore).toBe("number");
    expect(result.priorityScore).toBeGreaterThanOrEqual(0);
    expect(result.priorityScore).toBeLessThanOrEqual(100);

    // エラー件数が閾値に近い場合、スコアが期待値内であることを確認
    // 仕様書の計算式: priorityScore = (1 - (errorCount / errorThreshold)) * baseScore + adjustments
    // errorCount=99, errorThreshold=100 の場合: (1 - 99/100) * 100 + その他調整値
    // 期待値: 約71.0（基本計算値1 + 他の要因による調整）
    expect(result.priorityScore).toBeCloseTo(71.0, 1);

    // 同じ入力での複数実行で同一スコアが得られることを確認
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(stubEngineResponse), {
      status: 200,
    });

    const resultSecondRun = evaluatePatternRelevance(testData);
    expect(resultSecondRun.priorityScore).toBe(result.priorityScore);

    // スコアが単調増加する性質を確認（エラー件数が増えるとスコアが減少）
    const testDataHighError = {
      ...testData,
      errorCount: 98, // エラー件数が減少
    };

    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(stubEngineResponse), {
      status: 200,
    });

    const resultLowerError = evaluatePatternRelevance(testDataHighError);
    expect(resultLowerError.priorityScore).toBeGreaterThan(result.priorityScore);

    // 関連度スコアが返却されていることを確認
    expect(typeof result.relevanceScore).toBe("number");
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1);

    // 適用可能性が真偽値として返却されることを確認
    expect(typeof result.isApplicable).toBe("boolean");
  });
});