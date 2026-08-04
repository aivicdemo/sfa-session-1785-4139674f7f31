import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けルール生成機能", () => {
  // SCEN-2764
  test("失敗商談のみの場合、失敗パターンを回避すべき特徴量として抽出される", () => {
    // 失敗商談のみで構成される過去商談データセット
    const failedDealsOnly = [
      {
        dealId: "D001",
        customerId: "C001",
        customerIndustry: "小売",
        customerScale: "中堅企業",
        proposalAmount: 5000000,
        dealDurationDays: 90,
        success: false,
        successFactor: null,
      },
      {
        dealId: "D002",
        customerId: "C002",
        customerIndustry: "小売",
        customerScale: "中堅企業",
        proposalAmount: 4800000,
        dealDurationDays: 85,
        success: false,
        successFactor: null,
      },
      {
        dealId: "D003",
        customerId: "C003",
        customerIndustry: "製造",
        customerScale: "大企業",
        proposalAmount: 8000000,
        dealDurationDays: 120,
        success: false,
        successFactor: null,
      },
    ];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 失敗パターン抽出処理を実行
    const generatedRule = extractSuccessPatterns(
      failedDealsOnly,
      mockAIEngine
    );

    // 生成されたルールの検証
    expect(generatedRule).toBeDefined();
    expect(generatedRule.ruleId).toBeDefined();

    // 失敗商談に共通する特徴量が「回避すべき特徴量」として負の重み付けを持つことを検証
    expect(generatedRule.featureWeights).toBeDefined();
    expect(Array.isArray(generatedRule.featureWeights)).toBe(true);

    // 小売業界の重み付けが負であることを検証（失敗商談に頻出）
    const retailIndustryWeight = generatedRule.featureWeights.find(
      (f: {featureName: string; weight: number}) =>
        f.featureName === "customerIndustry_小売"
    );
    expect(retailIndustryWeight).toBeDefined();
    expect(retailIndustryWeight.weight).toBeLessThan(0);

    // 中堅企業規模の重み付けが負であることを検証（失敗商談に頻出）
    const midMarketScaleWeight = generatedRule.featureWeights.find(
      (f: {featureName: string; weight: number}) =>
        f.featureName === "customerScale_中堅企業"
    );
    expect(midMarketScaleWeight).toBeDefined();
    expect(midMarketScaleWeight.weight).toBeLessThan(0);

    // 提案金額帯（400万～500万）の重み付けが負であることを検証
    const proposalAmountWeight = generatedRule.featureWeights.find(
      (f: {featureName: string; weight: number}) =>
        f.featureName === "proposalAmountBand_4000000_5000000"
    );
    expect(proposalAmountWeight).toBeDefined();
    expect(proposalAmountWeight.weight).toBeLessThan(0);

    // ルールのステータスが「回避パターン」として記録されることを検証
    expect(generatedRule.ruleType).toBe("avoidancePattern");
    expect(generatedRule.successDealsCount).toBe(0);
    expect(generatedRule.failedDealsCount).toBe(3);

    // ルールマスタへの登録フラグが正しく設定されていることを検証
    expect(generatedRule.shouldRegisterToMaster).toBe(true);
    expect(generatedRule.registrationReason).toMatch(/失敗パターン/);
  });
});