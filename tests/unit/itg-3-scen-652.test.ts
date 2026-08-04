import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-652: [edge] 顧客情報入力検証機能 - 電話番号が0件のとき、該当項目の修正を促す
  test("should display error message and prevent form submission when phone number is empty", () => {
    // Arrange: 顧客情報を準備。電話番号フィールドは空、その他必須項目は正常
    const customerInfo = {
      name: "田中太郎",
      email: "tanaka@example.com",
      phone: "",
      company: "株式会社サンプル",
      industry: "IT",
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: バリデーション処理を実行
    const result = validateCustomerInfo(customerInfo, aiRecommendationEngineStub);

    // Assert: エラーメッセージが存在することを確認
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "phone",
          message: expect.stringMatching(/電話番号/),
        }),
      ])
    );

    // Assert: AIRecommendationEngineへの呼び出しが行われていないことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();

    // Assert: フォーム送信が阻止されていることを確認
    expect(result.canProceed).toBe(false);
  });
});