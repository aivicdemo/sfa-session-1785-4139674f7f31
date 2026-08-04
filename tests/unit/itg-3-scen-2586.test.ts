import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出機能 - 失敗パターン除外ロジック", () => {
  // SCEN-2586
  test("失敗した商談件数が閾値直上(5件)のとき、失敗パターンから除外される", async () => {
    // 準備: 失敗パターン抽出の閾値を「失敗商談件数 ≥ 5件」に設定
    const failureThreshold = 5;

    // スタブ化: AIRecommendationEngine.findSimilarPatterns の応答データ
    // - 失敗パターンA: 失敗商談 5件
    // - 成功パターンB: 成功商談 10件
    const pastPatterns = [
      {
        patternId: "PATTERN_FAILURE_A",
        type: "failure",
        dealCount: 5,
        successRate: 0.0,
        customerIndustry: "製造業",
        dealValue: 500000,
        proposalApproach: "提案アプローチA（失敗パターン）",
      },
      {
        patternId: "PATTERN_SUCCESS_B",
        type: "success",
        dealCount: 10,
        successRate: 1.0,
        customerIndustry: "金融業",
        dealValue: 1000000,
        proposalApproach: "提案アプローチB（成功パターン）",
      },
    ];

    // 入力データ: 失敗商談を丁度5件含むデータセット
    const inputData = {
      customerId: "CUST_001",
      customerIndustry: "製造業",
      dealValue: 500000,
      dealStage: "提案準備段階",
      pastDealsCount: 15, // 失敗5件 + 成功10件
      failedDealsCount: 5,
      successfulDealsCount: 10,
    };

    // 成功パターン抽出ロジックを実行
    const result = await generateRecommendation(inputData, {
      findSimilarPatterns: async () => pastPatterns,
      failureThreshold: failureThreshold,
    });

    // 検証1: 推奨パターンマスタに成功パターンB のみが格納されている
    expect(result.recommendedPatterns).toHaveLength(1);
    expect(result.recommendedPatterns[0].patternId).toBe("PATTERN_SUCCESS_B");
    expect(result.recommendedPatterns[0].type).toBe("success");
    expect(result.recommendedPatterns[0].dealCount).toBe(10);
    expect(result.recommendedPatterns[0].successRate).toBe(1.0);

    // 検証2: 失敗パターンA は失敗パターン一覧から除外されている
    const excludedFailurePatterns = result.excludedPatterns || [];
    const failurePatternFound = excludedFailurePatterns.find(
      (p: { patternId: string; type: string; dealCount: number }) =>
        p.patternId === "PATTERN_FAILURE_A"
    );

    // 失敗パターンが完全に除外されていることを確認
    expect(
      result.recommendedPatterns.some(
        (p: { patternId: string }) => p.patternId === "PATTERN_FAILURE_A"
      )
    ).toBe(false);

    // 検証3: generateRecommendation の戻り値に成功パターンB に基づいた推奨内容のみが含まれている
    expect(result.proposalApproach).toBe("提案アプローチB（成功パターン）");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    // 検証4: 失敗パターンの根拠説明や参考情報は生成されない
    expect(result.reasoning).not.toContain("失敗パターンA");
    expect(result.reasoning).toContain("パターンB");

    // 検証5: 推奨根拠が成功パターンに基づいている
    expect(result.basePattern).toBe("PATTERN_SUCCESS_B");
  });
});