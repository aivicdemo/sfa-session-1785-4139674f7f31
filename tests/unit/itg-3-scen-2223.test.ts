import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-2223
  test("[normal] 過去商談データから成功パターンが抽出される", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_001",
          industry: "製造業",
          companySize: "中堅企業",
          productCategory: "生産管理システム",
          contractAmount: 5000000,
          salesPeriodDays: 90,
          relevanceScore: 0.95,
          proposalContent: {
            mainFeatures: ["在庫管理", "生産スケジュール管理"],
            implementationPeriod: 180,
            expectedROI: 0.35,
          },
          customerAttributes: {
            numberOfEmployees: 500,
            annualRevenue: 50000000,
            industry: "製造業",
            region: "関東",
          },
          contractResult: {
            status: "成約",
            signedDate: "2023-06-15",
            implementationStartDate: "2023-07-01",
          },
        },
        {
          patternId: "pattern_002",
          industry: "製造業",
          companySize: "中堅企業",
          productCategory: "生産管理システム",
          contractAmount: 4200000,
          salesPeriodDays: 75,
          relevanceScore: 0.88,
          proposalContent: {
            mainFeatures: ["品質管理", "生産計画"],
            implementationPeriod: 150,
            expectedROI: 0.32,
          },
          customerAttributes: {
            numberOfEmployees: 450,
            annualRevenue: 45000000,
            industry: "製造業",
            region: "中部",
          },
          contractResult: {
            status: "成約",
            signedDate: "2023-08-20",
            implementationStartDate: "2023-09-01",
          },
        },
        {
          patternId: "pattern_003",
          industry: "製造業",
          companySize: "中堅企業",
          productCategory: "生産管理システム",
          contractAmount: 3800000,
          salesPeriodDays: 85,
          relevanceScore: 0.81,
          proposalContent: {
            mainFeatures: ["コスト管理", "生産最適化"],
            implementationPeriod: 160,
            expectedROI: 0.28,
          },
          customerAttributes: {
            numberOfEmployees: 350,
            annualRevenue: 35000000,
            industry: "製造業",
            region: "関西",
          },
          contractResult: {
            status: "成約",
            signedDate: "2023-05-10",
            implementationStartDate: "2023-06-01",
          },
        },
      ]),
    };

    const newDealCondition = {
      industry: "製造業",
      companySize: "中堅企業",
      productCategory: "生産管理システム",
    };

    const result = await findSimilarPatterns(newDealCondition, mockAIEngine);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);

    expect(result[0].relevanceScore).toBe(0.95);
    expect(result[1].relevanceScore).toBe(0.88);
    expect(result[2].relevanceScore).toBe(0.81);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].relevanceScore).toBeGreaterThanOrEqual(
        result[i + 1].relevanceScore
      );
    }

    result.forEach((pattern) => {
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.7);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(1.0);
    });

    result.forEach((pattern) => {
      expect(pattern).toHaveProperty("patternId");
      expect(pattern).toHaveProperty("industry");
      expect(pattern).toHaveProperty("companySize");
      expect(pattern).toHaveProperty("productCategory");
      expect(pattern).toHaveProperty("contractAmount");
      expect(pattern).toHaveProperty("salesPeriodDays");
      expect(pattern).toHaveProperty("relevanceScore");
      expect(pattern).toHaveProperty("proposalContent");
      expect(pattern).toHaveProperty("customerAttributes");
      expect(pattern).toHaveProperty("contractResult");
    });

    expect(result[0].industry).toBe("製造業");
    expect(result[0].companySize).toBe("中堅企業");
    expect(result[0].productCategory).toBe("生産管理システム");
    expect(result[0].contractAmount).toBe(5000000);
    expect(result[0].salesPeriodDays).toBe(90);

    expect(result[0].customerAttributes.numberOfEmployees).toBe(500);
    expect(result[0].customerAttributes.annualRevenue).toBe(50000000);
    expect(result[0].customerAttributes.industry).toBe("製造業");

    expect(result[0].contractResult.status).toBe("成約");
    expect(result[0].contractResult.signedDate).toBe("2023-06-15");

    expect(result[0].proposalContent.mainFeatures).toContain("在庫管理");
    expect(result[0].proposalContent.mainFeatures).toContain(
      "生産スケジュール管理"
    );
    expect(result[0].proposalContent.implementationPeriod).toBe(180);
    expect(result[0].proposalContent.expectedROI).toBe(0.35);
  });
});