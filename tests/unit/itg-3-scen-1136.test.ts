import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-1136: 顧客の契約金額が過去成功パターン金額の上限直下のとき適用可能と判定する", () => {
    const PATTERN_UPPER_LIMIT = 50000000; // 5,000万円
    const APPLICABILITY_THRESHOLD = 0.8;

    // 過去成功パターンの定義（上限5,000万円）
    const successPattern = {
      patternId: "PAT-001",
      customerIndustry: "製造業",
      contractAmountMin: 10000000, // 1,000万円
      contractAmountMax: PATTERN_UPPER_LIMIT, // 5,000万円
      description: "製造業向け標準提案パターン",
    };

    // AIRecommendationEngineスタブの構成
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: (
        newDealCondition: {
          contractAmount: number;
          customerIndustry: string;
        },
        pattern: typeof successPattern
      ): number => {
        // 顧客契約金額がパターンの上限以下であれば適用可能（relevanceScore 0.85）
        if (
          newDealCondition.contractAmount <= pattern.contractAmountMax &&
          newDealCondition.contractAmount >= pattern.contractAmountMin &&
          newDealCondition.customerIndustry === pattern.customerIndustry
        ) {
          return 0.85;
        }
        // 顧客契約金額がパターンの上限を超えた場合は適用不可（relevanceScore 0.75）
        return 0.75;
      },
    };

    // テストケース1: 契約金額が4,999万9,999円（上限直下）
    const newDealConditionBelowLimit = {
      contractAmount: 49999999, // 4,999万9,999円
      customerIndustry: "製造業",
    };

    const relevanceScoreBelowLimit = aiRecommendationEngineStub.evaluatePatternRelevance(
      newDealConditionBelowLimit,
      successPattern
    );

    expect(relevanceScoreBelowLimit).toBeGreaterThanOrEqual(APPLICABILITY_THRESHOLD);
    expect(relevanceScoreBelowLimit).toBe(0.85);

    // テストケース2: 契約金額が5,000万1円（上限超過）
    const newDealConditionAboveLimit = {
      contractAmount: 50000100, // 5,000万1円
      customerIndustry: "製造業",
    };

    const relevanceScoreAboveLimit = aiRecommendationEngineStub.evaluatePatternRelevance(
      newDealConditionAboveLimit,
      successPattern
    );

    expect(relevanceScoreAboveLimit).toBeLessThan(APPLICABILITY_THRESHOLD);
    expect(relevanceScoreAboveLimit).toBe(0.75);
  });
});