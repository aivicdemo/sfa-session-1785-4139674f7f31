import { calculateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1672
  test("推奨スコア算出機能 - 購買履歴のデータ型が不正のとき、エラーが発生する", () => {
    const invalidPurchaseHistory = {
      customerId: "CUST001",
      purchaseAmount: "15000",
      purchaseDate: "2024-01-15",
      productCategory: "software",
    };

    expect(() => calculateRecommendationScore(invalidPurchaseHistory)).toThrow(
      /金額|数値型|型が不正/
    );
  });
});