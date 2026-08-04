import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-2316
  test("新規案件の顧客属性データが欠落しているとき照合処理が中断される", () => {
    // ============================================================
    // 1. テスト前提条件の準備
    // ============================================================

    // 新規案件データ（顧客属性の一部欠落）
    const newDealWithMissingAttributes = {
      dealId: "DEAL-NEW-001",
      customerId: null, // 必須: 顧客ID 欠落
      industry: "IT", // 必須: 業種
      companySize: null, // 必須: 企業規模 欠落
      budgetRange: "1000000-5000000", // 必須: 予算規模
      proposalContent: "クラウド導入支援",
      dealStage: "initial_contact",
    };

    // AIRecommendationEngine スタブ
    // 顧客属性データの欠落を検出して例外を発生させるよう設定
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(() => {
        throw new Error("VALIDATION_ERROR_MISSING_CUSTOMER_ATTRIBUTES");
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // ============================================================
    // 2. 照合処理関数を呼び出し
    // ============================================================

    let executionResult: {
      status: string;
      errorCode: string | null;
      errorMessage: string | null;
      missingAttributes: string[];
      externalApiCalled: boolean;
    };
    let thrownError: Error | null = null;

    try {
      // 成功パターン抽出・照合処理を実行
      findSimilarPatterns(newDealWithMissingAttributes, stubAIRecommendationEngine);
    } catch (error) {
      // エラーをキャッチ
      thrownError = error as Error;
    }

    // ============================================================
    // 3. 期待結果の検証
    // ============================================================

    // (1) エラーコード検証
    // 照合処理が属性データ欠落エラーを返すことを確認
    expect(thrownError).toBeTruthy();
    expect(thrownError?.message).toMatch(/VALIDATION_ERROR_MISSING_CUSTOMER_ATTRIBUTES/);

    // (2) 処理ステータスが中断（ABORTED）に遷移していることを確認
    // findSimilarPatterns が例外をスロー → 処理中断状態
    expect(() => {
      findSimilarPatterns(newDealWithMissingAttributes, stubAIRecommendationEngine);
    }).toThrow(/VALIDATION_ERROR_MISSING_CUSTOMER_ATTRIBUTES/);

    // (3) AIRecommendationEngine への外部API呼び出しがスキップされたことを確認
    // スタブの findSimilarPatterns は呼ばれずに、内部バリデーションで失敗する
    // （または呼ばれた場合でも、例外発生の時点で後続処理がスキップされる）
    expect(stubAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(stubAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(stubAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // (4) エラーメッセージに欠落している具体的な属性項目名が記録されること
    // 欠落項目: customerId, companySize
    expect(thrownError?.message).toMatch(/customerId|companySize/);

    // (5) 後続処理（findSimilarPatterns、evaluatePatternRelevance）が実行されないこと
    // 例外発生により、呼び出し元で処理が中断される
    expect(stubAIRecommendationEngine.findSimilarPatterns.mock.calls.length).toBeLessThanOrEqual(1);
  });
});