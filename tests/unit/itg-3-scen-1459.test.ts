import {
  evaluateQualityScore,
  canUseForLearning,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  test("SCEN-1459: 品質スコアが許容値ちょうど0.8の購買履歴データが学習データとして使用可能と判定される", () => {
    // 準備: テスト用の購買履歴データセット
    const purchaseHistoryData = {
      customerId: "CUST_001",
      productCategory: "office_equipment",
      purchaseAmount: 50000,
      purchaseDateTime: "2024-01-15T10:30:00Z",
      quantity: 2,
    };

    // 品質スコア計算ロジックの実行
    const qualityScore = evaluateQualityScore(purchaseHistoryData);

    // 計算結果として品質スコア値0.8が戻されることを確認
    expect(qualityScore).toBe(0.8);

    // LearningDataValidator.canUseForLearning()メソッドに
    // データセットと品質スコア0.8を入力して実行
    const learningValidationResult = canUseForLearning(
      purchaseHistoryData,
      qualityScore
    );

    // 戻り値の判定フラグ（isUsableForLearning）がtrueであることを確認
    expect(learningValidationResult.isUsableForLearning).toBe(true);

    // 学習用データカタログテーブルに正常に追加されたことを確認
    // (新規レコード: データID、品質スコア値0.8、登録タイムスタンプ、学習可否フラグ=true)
    expect(learningValidationResult.dataId).toBeDefined();
    expect(learningValidationResult.qualityScore).toBe(0.8);
    expect(learningValidationResult.registeredAt).toBeDefined();
    expect(learningValidationResult.isUsableForLearning).toBe(true);
  });
});