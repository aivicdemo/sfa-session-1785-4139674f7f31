import { evaluateSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-271
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの導入期間が現在の顧客の購買タイミングより後の場合、適用可能と判定される", () => {
    const successPatternA = {
      patternId: "pattern_001",
      patternName: "成功パターンA",
      introductionStartDate: new Date("2024-04-01T00:00:00Z"),
      introductionEndDate: new Date("2024-06-30T23:59:59Z"),
      applicableCustomerAttributes: {
        industry: "IT",
        companySize: "large",
      },
      successRate: 0.75,
    };

    const customerPurchasingTiming = new Date("2024-03-15T00:00:00Z");

    const result = evaluateSuccessPatternApplicability({
      successPattern: successPatternA,
      customerPurchasingTiming: customerPurchasingTiming,
    });

    expect(result).toEqual({
      applicable: true,
      patternId: "pattern_001",
      reason:
        "成功パターンの導入期間開始日が顧客の購買タイミングより後であるため、パターン導入後に顧客がアプローチ対象となり得る",
    });
  });
});