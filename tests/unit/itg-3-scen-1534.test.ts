import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理 - 重複排除とスコア計算", () => {
  test("SCEN-1534: 過去の類似顧客パターンに重複データが含まれる場合、重複を排除して一致度スコアが計算される", async () => {
    // スタブデータ: 過去の類似顧客パターン（重複を含む）
    const mockSimilarPatterns = [
      {
        patternId: "pattern-a-1",
        industryType: "製造業",
        companyScale: "中堅",
        purchaseBudget: 50000000,
        matchScore: 0.92,
      },
      {
        patternId: "pattern-a-2",
        industryType: "製造業",
        companyScale: "中堅",
        purchaseBudget: 50000000,
        matchScore: 0.92,
      },
      {
        patternId: "pattern-b-1",
        industryType: "流通業",
        companyScale: "大手",
        purchaseBudget: 30000000,
        matchScore: 0.87,
      },
    ];

    // AIRecommendationEngine.findSimilarPatternsのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue(mockSimilarPatterns),
    };

    // 新規案件の条件
    const newDealCondition = {
      industryType: "製造業",
      companyScale: "中堅",
      purchaseBudget: 52000000,
    };

    // 類似顧客マッチング処理を実行
    const matchingResult = await findSimilarPatterns(
      newDealCondition,
      mockAIEngine
    );

    // マッチング結果に含まれるパターンの件数を確認
    // 重複を排除した場合、2件（パターンA 1件、パターンB 1件）
    expect(matchingResult).toHaveLength(2);

    // マッチング結果内の各パターンの一致度スコアを確認
    // パターンAの一致度スコアは0.92
    expect(matchingResult[0].matchScore).toBe(0.92);
    // パターンBの一致度スコアは0.87
    expect(matchingResult[1].matchScore).toBe(0.87);

    // 結果は一致度スコアの高い順に並び替えられているか確認
    expect(matchingResult[0].matchScore).toBeGreaterThanOrEqual(
      matchingResult[1].matchScore
    );

    // パターンAの顧客属性を確認
    expect(matchingResult[0].industryType).toBe("製造業");
    expect(matchingResult[0].companyScale).toBe("中堅");

    // パターンBの顧客属性を確認
    expect(matchingResult[1].industryType).toBe("流通業");
    expect(matchingResult[1].companyScale).toBe("大手");

    // 重複排除が正しく機能していることを確認
    const industryCompanyScaleCombos = new Set(
      matchingResult.map((p) => `${p.industryType}-${p.companyScale}`)
    );
    expect(industryCompanyScaleCombos.size).toBe(2);
  });
});