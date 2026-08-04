import { extractSuccessPatternTemplate } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  // SCEN-2545
  test("成功パターンテンプレート生成日が年度の終了日のとき、テンプレートに記録される", () => {
    const mockGeneratedDate = new Date("2024-03-31T23:59:59+09:00");
    const newProjectData = {
      customerId: "cust_001",
      customerName: "顧客A",
      industry: "製造業",
      companySize: "large",
      dealCondition: {
        dealId: "deal_12345",
        dealName: "案件001",
        estimatedValue: 5000000,
        stage: "提案中",
      },
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        successPatternTemplateId: "template_001",
        customerId: newProjectData.customerId,
        industry: newProjectData.industry,
        companySize: newProjectData.companySize,
        generatedDate: "2024-03-31T23:59:59+09:00",
        approachName: "大規模製造顧客向け標準アプローチ",
        keySuccessFactors: ["関係者との信頼構築", "段階的な提案"],
        riskFactors: ["導入期間の長期化"],
        recommendedActions: ["初回ヒアリング実施", "ROI試算書作成"],
      }),
    };

    const result = extractSuccessPatternTemplate(
      newProjectData,
      mockAIEngine,
      mockGeneratedDate
    );

    expect(result).toEqual(
      expect.objectContaining({
        successPatternTemplateId: "template_001",
        generatedDate: "2024-03-31T23:59:59+09:00",
        customerId: "cust_001",
        industry: "製造業",
        companySize: "large",
        approachName: "大規模製造顧客向け標準アプローチ",
      })
    );
    expect(result.generatedDate).toBe("2024-03-31T23:59:59+09:00");
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newProjectData
    );
  });
});