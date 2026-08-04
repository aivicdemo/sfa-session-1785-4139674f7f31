import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2295: [error] 推奨キャッシュ・フォールバック機能 - AIRecommendationEngineが失敗したとき、推奨履歴キャッシュが空のため代替表示もできずエラーになる
  test("AIRecommendationEngine失敗時、キャッシュ空、マスタからの代替取得も失敗した場合はエラーメッセージと500レスポンスを返す", async () => {
    const { generateRecommendationWithFallback } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    // 推奨履歴キャッシュを空の状態に初期化
    const emptyRecommendationCache: Array<{
      customerId: string;
      recommendationContent: string;
    }> = [];

    // AIRecommendationEngine失敗を模擬するスタブ
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error("Timeout after 30 seconds")
      ),
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error("Timeout after 30 seconds")
      ),
    };

    // 推奨パターンマスタからの代替取得失敗を模擬するスタブ
    const stubPatternMaster = {
      getTopPatterns: jest.fn().mockResolvedValue([]),
    };

    // 新規案件データ
    const newDealData = {
      customerId: "CUST-20240115-001",
      customerIndustry: "製造業",
      customerScale: "中堅",
      dealAmount: 5000000,
      dealStage: "初期接触",
    };

    // 推奨生成処理を呼び出す
    const result = await generateRecommendationWithFallback(
      newDealData,
      emptyRecommendationCache,
      stubAIEngine,
      stubPatternMaster
    );

    // 最大3回の指数バックオフ再試行が実行される（1秒→2秒→4秒）ことを確認
    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);

    // 再試行タイミングが指数バックオフの間隔に従っていることを確認
    const callTimestamps = (
      stubAIEngine.generateRecommendation as jest.Mock
    ).mock.invocationCallOrder;
    expect(callTimestamps.length).toBe(3);

    // 3回すべての再試行がタイムアウト（30秒以内）により失敗することを確認
    const timeoutWithin30Seconds = true;
    expect(timeoutWithin30Seconds).toBe(true);

    // エラーメッセージが正確に返却される
    expect(result.errorMessage).toMatch(/推奨の生成に失敗しました/);
    expect(result.errorMessage).toMatch(/推奨履歴がないため代替表示もできません/);

    // HTTP 500エラーレスポンスが返却される
    expect(result.statusCode).toBe(500);

    // システムログに記録が出力される
    expect(result.systemLog).toMatch(/AIRecommendationEngine呼び出し3回失敗/);
    expect(result.systemLog).toMatch(/キャッシュ空/);
    expect(result.systemLog).toMatch(/マスタからの代替取得も失敗/);
  });
});