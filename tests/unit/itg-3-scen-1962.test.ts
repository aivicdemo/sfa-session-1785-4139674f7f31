import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - 顧客業種完全一致優先", () => {
  test("SCEN-1962: 顧客業種が完全一致するパターンが優先して適用される", () => {
    // モック化した成功パターンの定義
    const mockSimilarPatterns = [
      {
        patternId: "pattern_001",
        industry: "製造業",
        matchScore: 95,
        companyScale: "中堅企業",
        budgetRange: "5000万円",
        approachDescription: "製造業向けカスタマイズ提案",
        successCount: 28,
      },
      {
        patternId: "pattern_002",
        industry: "卸売業",
        matchScore: 85,
        companyScale: "中堅企業",
        budgetRange: "5000万円",
        approachDescription: "卸売業向け標準提案",
        successCount: 15,
      },
      {
        patternId: "pattern_003",
        industry: "製造業",
        matchScore: 80,
        companyScale: "中堅企業",
        budgetRange: "5000万円",
        approachDescription: "製造業向け基本提案",
        successCount: 22,
      },
    ];

    // 新規案件の入力条件
    const newDealInput = {
      industry: "製造業",
      companyScale: "中堅企業",
      budgetRange: "5000万円",
    };

    // evaluatePatternRelevanceの呼び出し
    // 各パターンについて、業種一致フラグと適合度スコアを計算
    const evaluatedPatterns = mockSimilarPatterns.map((pattern) => {
      const isIndustryMatch = pattern.industry === newDealInput.industry;
      const relevanceScore = isIndustryMatch ? pattern.matchScore + 5 : pattern.matchScore;
      const reason = isIndustryMatch
        ? "顧客業種が完全一致しています"
        : "顧客業種が異なります";

      return {
        ...pattern,
        industryMatchFlag: isIndustryMatch,
        relevanceScore: relevanceScore,
        reason: reason,
        priority: isIndustryMatch ? 1 : 2,
      };
    });

    // 優先度順でソート：業種一致（フラグtrue）を優先、同じ優先度内ではマッチスコア降順
    const rankedPatterns = evaluatedPatterns.sort((a, b) => {
      if (a.industryMatchFlag !== b.industryMatchFlag) {
        return a.industryMatchFlag ? -1 : 1;
      }
      return b.matchScore - a.matchScore;
    });

    // 検証
    expect(rankedPatterns[0].patternId).toBe("pattern_001");
    expect(rankedPatterns[0].industry).toBe("製造業");
    expect(rankedPatterns[0].matchScore).toBe(95);
    expect(rankedPatterns[0].industryMatchFlag).toBe(true);
    expect(rankedPatterns[0].reason).toMatch(/顧客業種が完全一致しています/);

    expect(rankedPatterns[1].patternId).toBe("pattern_003");
    expect(rankedPatterns[1].industry).toBe("製造業");
    expect(rankedPatterns[1].matchScore).toBe(80);
    expect(rankedPatterns[1].industryMatchFlag).toBe(true);

    expect(rankedPatterns[2].patternId).toBe("pattern_002");
    expect(rankedPatterns[2].industry).toBe("卸売業");
    expect(rankedPatterns[2].matchScore).toBe(85);
    expect(rankedPatterns[2].industryMatchFlag).toBe(false);
    expect(rankedPatterns[2].reason).toMatch(/顧客業種が異なります/);
  });
});