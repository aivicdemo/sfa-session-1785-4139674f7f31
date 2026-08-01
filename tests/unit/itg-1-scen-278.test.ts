import { determineProposalApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-278: 成功パターンマトリクス参照による提案アプローチ判定機能 - 判断根拠に過去の成功事例の詳細情報が含まれている", () => {
    const successPatterns = [
      {
        patternId: "SUC-001",
        salesStage: "提案準備",
        customerIndustry: "製造業",
        dealSize: "1000万円以上",
        contractRate: 0.75,
        salesMethod: "コンサルティング型提案",
        customerAttributes: {
          industry: "製造業",
          companySize: "従業員500名以上",
          revenue: "売上50億円以上",
        },
        dealBackground: "生産効率化の経営課題",
        proposalContent: "IoT導入による自動化ソリューション",
        successFactors: [
          "顧客の経営課題の深掘り",
          "ROI試算の提示",
          "導入スケジュールの柔軟性",
        ],
      },
      {
        patternId: "SUC-002",
        salesStage: "提案準備",
        customerIndustry: "製造業",
        dealSize: "1000万円以上",
        contractRate: 0.68,
        salesMethod: "業界ベストプラクティス提案",
        customerAttributes: {
          industry: "製造業",
          companySize: "従業員300名以上",
          revenue: "売上30億円以上",
        },
        dealBackground: "品質管理の強化",
        proposalContent: "品質管理システムの導入",
        successFactors: [
          "業界事例の紹介",
          "導入後の品質向上実績の提示",
          "段階的な導入計画",
        ],
      },
      {
        patternId: "SUC-003",
        salesStage: "交渉段階",
        customerIndustry: "金融業",
        dealSize: "500万円以上1000万円未満",
        contractRate: 0.62,
        salesMethod: "リスク軽減型提案",
        customerAttributes: {
          industry: "金融業",
          companySize: "従業員100名以上",
          revenue: "売上10億円以上",
        },
        dealBackground: "システムリスク対応",
        proposalContent: "セキュリティ強化ソリューション",
        successFactors: [
          "コンプライアンス対応の明確化",
          "段階的な導入",
        ],
      },
    ];

    const input = {
      salesStage: "提案準備",
      customerIndustry: "製造業",
      dealSize: "1000万円以上",
      successPatterns: successPatterns,
    };

    const result = determineProposalApproach(input);

    expect(result).toHaveProperty("recommendedApproach");
    expect(result).toHaveProperty("reasoning");
    expect(Array.isArray(result.reasoning.matchedPatterns)).toBe(true);
    expect(result.reasoning.matchedPatterns.length).toBe(2);

    const matchedPatternIds = result.reasoning.matchedPatterns.map(
      (pattern: { patternId: string }) => pattern.patternId
    );
    expect(matchedPatternIds).toContain("SUC-001");
    expect(matchedPatternIds).toContain("SUC-002");

    result.reasoning.matchedPatterns.forEach(
      (pattern: {
        patternId: string;
        contractRate: number;
        salesMethod: string;
        customerAttributes: object;
        dealBackground: string;
        proposalContent: string;
        successFactors: string[];
      }) => {
        expect(pattern).toHaveProperty("patternId");
        expect(typeof pattern.patternId).toBe("string");

        expect(pattern).toHaveProperty("contractRate");
        expect(typeof pattern.contractRate).toBe("number");
        expect(pattern.contractRate).toBeGreaterThan(0);
        expect(pattern.contractRate).toBeLessThanOrEqual(1);

        expect(pattern).toHaveProperty("salesMethod");
        expect(typeof pattern.salesMethod).toBe("string");
        expect(pattern.salesMethod.length).toBeGreaterThan(0);

        expect(pattern).toHaveProperty("customerAttributes");
        expect(typeof pattern.customerAttributes).toBe("object");
        expect(pattern.customerAttributes).not.toBeNull();

        expect(pattern).toHaveProperty("dealBackground");
        expect(typeof pattern.dealBackground).toBe("string");
        expect(pattern.dealBackground.length).toBeGreaterThan(0);

        expect(pattern).toHaveProperty("proposalContent");
        expect(typeof pattern.proposalContent).toBe("string");
        expect(pattern.proposalContent.length).toBeGreaterThan(0);

        expect(pattern).toHaveProperty("successFactors");
        expect(Array.isArray(pattern.successFactors)).toBe(true);
        expect(pattern.successFactors.length).toBeGreaterThan(0);
        pattern.successFactors.forEach((factor: string) => {
          expect(typeof factor).toBe("string");
          expect(factor.length).toBeGreaterThan(0);
        });
      }
    );

    const suc001Pattern = result.reasoning.matchedPatterns.find(
      (p: { patternId: string }) => p.patternId === "SUC-001"
    );
    expect(suc001Pattern).toBeDefined();
    expect(suc001Pattern.contractRate).toBe(0.75);
    expect(suc001Pattern.salesMethod).toBe("コンサルティング型提案");
    expect(suc001Pattern.dealBackground).toBe("生産効率化の経営課題");
    expect(suc001Pattern.proposalContent).toBe("IoT導入による自動化ソリューション");
    expect(suc001Pattern.successFactors).toEqual([
      "顧客の経営課題の深掘り",
      "ROI試算の提示",
      "導入スケジュールの柔軟性",
    ]);

    const suc002Pattern = result.reasoning.matchedPatterns.find(
      (p: { patternId: string }) => p.patternId === "SUC-002"
    );
    expect(suc002Pattern).toBeDefined();
    expect(suc002Pattern.contractRate).toBe(0.68);
    expect(suc002Pattern.salesMethod).toBe("業界ベストプラクティス提案");
    expect(suc002Pattern.dealBackground).toBe("品質管理の強化");
    expect(suc002Pattern.proposalContent).toBe("品質管理システムの導入");
    expect(suc002Pattern.successFactors).toEqual([
      "業界事例の紹介",
      "導入後の品質向上実績の提示",
      "段階的な導入計画",
    ]);
  });
});