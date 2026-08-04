import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 過去商談データから成功パターン抽出と提案アプローチ推奨", () => {
  test("SCEN-1024: OpenAI API 4回目呼び出し失敗時、内部推奨パターンマスタから代替推奨が返却される", async () => {
    // Arrange: AIRecommendationEngine スタブの設定
    const aiEngineStub = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error("timeout"))
        .mockRejectedValueOnce(new Error("timeout"))
        .mockRejectedValueOnce(new Error("timeout"))
        .mockRejectedValueOnce(new Error("timeout")),
    };

    // 推奨パターンマスタのテストデータ
    const recommendationPatternMaster = {
      patternId: "PAT-001",
      patternName: "初期接触でのニーズヒアリング重視型",
      successRate: 78,
      appliedCount: 45,
    };

    // 新規案件情報
    const newDealInfo = {
      customerSize: "中堅企業",
      industry: "製造業",
      challenge: "業務効率化",
    };

    // リトライログの記録用配列
    const retryLog: Array<{ attempt: number; delay: number; timestamp: string }> = [];

    // Act: 推奨生成処理を実行
    const result = await generateRecommendation(
      newDealInfo,
      aiEngineStub,
      recommendationPatternMaster,
      retryLog
    );

    // Assert: リトライ処理の検証
    expect(retryLog).toHaveLength(3);
    expect(retryLog[0].delay).toBe(1000); // 1秒
    expect(retryLog[1].delay).toBe(2000); // 2秒
    expect(retryLog[2].delay).toBe(4000); // 4秒

    // Assert: 代替推奨の返却値を検証
    expect(result.recommendation.patternId).toBe("PAT-001");
    expect(result.recommendation.patternName).toBe("初期接触でのニーズヒアリング重視型");
    expect(result.recommendation.successRate).toBe(78);
    expect(result.recommendation.appliedCount).toBe(45);

    // Assert: ユーザー向けメッセージの検証
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    // Assert: 根拠説明が簡略版であることを検証
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.isSimplified).toBe(true);
    expect(result.reasoning.sourceType).toBe("fallback_pattern_master");

    // Assert: AIエージェント呼び出しの回数を検証（4回全て失敗）
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(4);
  });
});