import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-2493
  test("[normal] 過去商談の類似案件検索機能 - 現在の商談条件に類似した過去成功事例が0件のとき、空の結果が返却される", () => {
    // Arrange: AIRecommendationEngineのスタブを作成
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    // テスト用の商談条件オブジェクトを作成
    const dealCondition = {
      industry: "製造業",
      productCategory: "IoTソリューション",
      budgetRange: "5000万円以上",
      dealStage: "初期接触",
      companySize: "大企業",
    };

    // Act: 過去商談の類似案件検索機能を実行
    const result = findSimilarPatterns(dealCondition, mockAIEngine);

    // Assert: 検索結果が空配列で返却されることを確認
    expect(result).resolves.toEqual([]);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});