import { generateRecommendationWithHistory } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 推奨履歴テーブル挿入エラー時の処理", () => {
  test("SCEN-851: 推奨履歴テーブルへのレコード挿入に失敗したとき、エラーで処理が進まない", async () => {
    // ===== 初期化 =====
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockDatabaseAdapter = {
      insertRecommendationHistory: jest.fn(),
      selectRecommendationHistory: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
    };

    // ===== AIRecommendationEngine スタブ設定 =====
    // AIエージェントが有効な推奨内容を生成
    const recommendationId = "REC-20250115-001";
    const trustScoreFromAI = 87;
    const recommendationReasoning =
      "顧客の業種（IT）と規模（従業員500名）から、過去の成功事例REC-2024-0521と類似度0.92で合致。当事例では同規模IT企業への提案で成約率78%を達成。提案内容（クラウド導入支援）は顧客の経営課題（コスト削減）と直結。";

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendationId: recommendationId,
      trustScore: trustScoreFromAI,
      proposalApproach: "クラウド導入支援プログラム",
      estimatedSuccessProbability: 0.78,
    });

    mockAIRecommendationEngine.explainRecommendationReasoning.mockResolvedValue(
      {
        reasoningText: recommendationReasoning,
        relatedHistoricalCases: ["REC-2024-0521", "REC-2024-0388"],
      }
    );

    // ===== DB エラー設定 =====
    // 推奨履歴テーブルへの挿入時に constraint violation エラーが発火
    const dbErrorMessage = "Failed to insert recommendation record into database";
    const dbError = new Error(dbErrorMessage);
    mockDatabaseAdapter.insertRecommendationHistory.mockRejectedValue(dbError);

    // ===== 入力：新規案件情報 =====
    const newProjectInput = {
      customerId: "CUST-20250115-009",
      customerName: "ABC Technologies Inc.",
      industry: "IT",
      companyScale: 500,
      dealStage: "initial_contact",
      budgetRange: "1000000-5000000",
      mainChallenge: "cost_reduction",
    };

    // ===== テスト実行 =====
    try {
      await generateRecommendationWithHistory(
        newProjectInput,
        mockAIRecommendationEngine,
        mockDatabaseAdapter,
        mockLogger
      );

      // エラーが発生すべきなので、ここに到達してはいけない
      fail("Expected generateRecommendationWithHistory to throw an error");
    } catch (error) {
      // ===== エラー検証 =====
      // DB挿入失敗を示すエラーが throw される
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/推奨履歴テーブル|推奨記録|挿入|失敗/i);

      // ===== 処理中断の確認 =====
      // DBへの挿入が試みられたが失敗している
      expect(mockDatabaseAdapter.insertRecommendationHistory).toHaveBeenCalled();

      // AIエンジンは呼ばれている（推奨内容生成までは成功）
      expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
        newProjectInput
      );

      // ===== ユーザー画面表示確認 =====
      // エラーログが記録されている
      expect(mockLogger.error).toHaveBeenCalled();
      const errorLogCall = mockLogger.error.mock.calls[0];
      expect(errorLogCall[0]).toMatch(/推奨の生成に失敗|エラー|失敗/i);

      // ===== システムログ確認 =====
      // RecommendationHistoryInsertionError が記録される
      const errorLogContent = String(errorLogCall);
      expect(errorLogContent).toMatch(/RecommendationHistoryInsertionError|推奨履歴|挿入/i);

      // ===== 後続処理が実行されないことを確認 =====
      // DB削除・更新操作は呼ばれていない（推奨履歴への挿入が失敗したので、以降の処理が進まない）
      expect(mockDatabaseAdapter.insertRecommendationHistory.mock.calls.length).toBe(
        1
      );
    }
  });
});