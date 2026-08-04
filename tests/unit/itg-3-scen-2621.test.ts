import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2621
  test("推奨提案アプローチの根拠として、顧客属性の一致度が50%である場合、その旨が表示される", () => {
    const recommendation_approach = "クラウドシステムの段階導入プラン";
    const customer_attribute_match_rate = 50;
    const match_reason = "業種と導入時期が過去成功パターンと合致、企業規模は部分的合致";
    const industry = "製造業";
    const company_scale = "中堅企業";
    const budget = "5000万円";
    const implementation_timeline = "3ヶ月以内";

    const result = explainRecommendationReasoning({
      recommendation_approach,
      customer_attribute_match_rate,
      match_reason,
      industry,
      company_scale,
      budget,
      implementation_timeline,
    });

    const expected_explanation =
      "この推奨の根拠：顧客属性の一致度は50%です。業種（製造業）と導入時期（3ヶ月以内）が過去の成功事例と一致しており、企業規模（中堅企業）は部分的に適合しています。";

    expect(result.explanation).toBe(expected_explanation);
    expect(result.match_rate_percentage).toBe(50);
  });
});