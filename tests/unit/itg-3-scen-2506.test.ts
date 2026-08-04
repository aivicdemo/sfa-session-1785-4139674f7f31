import { generateSuccessPatternTemplate } from "../../src/logic/it-1-br-3-1-1-1";

describe("成功パターンテンプレート設計機能 - 成功要因と失敗要因の重複検証", () => {
  // SCEN-2506
  test("成功要因と失敗要因に同じ項目が含まれている場合、テンプレート生成がエラーになる", () => {
    const success_factors = [
      "顧客の予算確保",
      "営業担当者の提案スキル",
      "競合状況の把握",
    ];
    const failure_factors = [
      "顧客の予算未確保",
      "営業担当者の提案スキル",
      "市場調査不足",
    ];

    const fn = () =>
      generateSuccessPatternTemplate({
        success_factors: success_factors,
        failure_factors: failure_factors,
      });

    expect(fn).toThrow(/営業担当者の提案スキル/);
  });
});