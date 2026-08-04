import { evaluateRecommendationTrustworthiness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-852: 信頼度スコアがInfinityのとき、エラーハンドリングと代替表示が機能する", () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mockAiEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        trustworthinessScore: Infinity,
        matchedPatterns: [
          {
            patternId: "PAT-001",
            patternName: "成功パターンA",
            matchRate: 0.85,
          },
        ],
        analysisDetails: "分析詳細情報",
      }),
    };

    // スタブから返却されたInfinity値が使用されることをモックするロギングシステム
    const mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    };

    // テスト対象への入力: 有効な商談条件データ
    const dealConditions = {
      customerId: "CUST-12345",
      customerName: "株式会社サンプル",
      industryCategory: "製造業",
      companyScale: "大企業",
      productCategory: "クラウドERPシステム",
      budgetAmount: 5000000,
      proposalApproach: "段階的導入アプローチ",
      decisionMakerRole: "CTO",
      purchasingCycle: "12ヶ月",
    };

    // Act: 推奨内容の信頼度スコア算出・根拠提示機能を実行
    const result = evaluateRecommendationTrustworthiness(
      dealConditions,
      mockAiEngine,
      mockLogger
    );

    // Assert: 信頼度スコアがInfinityの場合の処理確認
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/信頼度スコアが無効な値（Infinity）のため処理を中断しました/)
    );

    // ユーザーへの表示メッセージが正しい
    expect(result.userDisplayMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    // 処理が停止し、推奨内容の生成がスキップされている
    expect(result.recommendationContent).toBeUndefined();

    // キャッシュされた過去推奨が代替表示される
    expect(result.cachedRecommendations).toBeDefined();
    expect(Array.isArray(result.cachedRecommendations)).toBe(true);

    // 根拠説明が簡略版で表示される
    expect(result.reasoningExplanation).toBe("簡略版");

    // スタブからの呼び出しが正確に記録されている
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealConditions
    );

    // エラーログに『信頼度スコアが無効な値（Infinity）のため処理を中断しました』が含まれている
    const errorLogCalls = mockLogger.error.mock.calls;
    const hasExpectedErrorMessage = errorLogCalls.some((call) =>
      call[0].includes("信頼度スコアが無効な値（Infinity）のため処理を中断しました")
    );
    expect(hasExpectedErrorMessage).toBe(true);
  });
});