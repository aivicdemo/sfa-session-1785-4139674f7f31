import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件に適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-197: OpenAI APIが正常に応答するとき、生成AIによって顧客条件に最適化された提案アプローチが返却される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [
          {
            approach: "段階的導入パターン",
            applicabilityScore: 0.92,
            reasoning:
              "製造業での生産効率向上は段階的な導入によるリスク低減が有効。500名規模の組織変更対応力を考慮した場合、段階的導入により現場抵抗を最小化できます。過去同規模案件での成功率は88%です。",
          },
          {
            approach: "ROI重視プレゼン",
            applicabilityScore: 0.88,
            reasoning:
              "予算500万円という限定的な投資規模では、ROI明確化が意思決定の中核になります。3ヶ月の検討期間は投資回収シミュレーション展開に十分です。過去同予算帯案件での採用率は75%です。",
          },
          {
            approach: "業界同業他社事例活用",
            applicabilityScore: 0.85,
            reasoning:
              "製造業の生産効率向上課題は業界共通パターンです。同業他社の成功事例を活用することで、顧客の導入イメージが鮮明化され、意思決定スピード向上に寄与します。過去同業案件での引用率は82%です。",
          },
        ],
        primaryApproach: "段階的導入パターン",
        customerProfile: {
          industry: "製造業",
          employeeCount: 500,
          businessChallenge: "生産効率向上",
        },
        dealContext: {
          budget: 5000000,
          evaluationPeriodDays: 90,
        },
        generatedAt: new Date("2024-01-15T10:30:00Z").toISOString(),
      }),
    };

    const inputCustomerInfo = {
      industry: "製造業",
      employeeCount: 500,
      businessChallenge: "生産効iciency向上",
    };

    const inputDealContext = {
      budget: 5000000,
      evaluationPeriodDays: 90,
    };

    const result = await generateRecommendation(inputCustomerInfo, inputDealContext, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendedApproaches).toBeDefined();
    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.recommendedApproaches.length).toBe(3);

    const firstApproach = result.recommendedApproaches[0];
    expect(firstApproach.approach).toBe("段階的導入パターン");
    expect(typeof firstApproach.applicabilityScore).toBe("number");
    expect(firstApproach.applicabilityScore).toBeGreaterThanOrEqual(0);
    expect(firstApproach.applicabilityScore).toBeLessThanOrEqual(1);
    expect(firstApproach.applicabilityScore).toBe(0.92);
    expect(typeof firstApproach.reasoning).toBe("string");
    expect(firstApproach.reasoning.length).toBeGreaterThan(0);

    const secondApproach = result.recommendedApproaches[1];
    expect(secondApproach.approach).toBe("ROI重視プレゼン");
    expect(secondApproach.applicabilityScore).toBe(0.88);
    expect(secondApproach.reasoning).toContain("予算500万円");

    const thirdApproach = result.recommendedApproaches[2];
    expect(thirdApproach.approach).toBe("業界同業他社事例活用");
    expect(thirdApproach.applicabilityScore).toBe(0.85);
    expect(thirdApproach.reasoning).toContain("同業他社");

    expect(result.primaryApproach).toBe("段階的導入パターン");

    expect(result.customerProfile).toEqual({
      industry: "製造業",
      employeeCount: 500,
      businessChallenge: "生産効率向上",
    });

    expect(result.dealContext).toEqual({
      budget: 5000000,
      evaluationPeriodDays: 90,
    });

    expect(typeof result.generatedAt).toBe("string");
    expect(new Date(result.generatedAt).toISOString()).toBe(
      new Date("2024-01-15T10:30:00Z").toISOString()
    );

    for (const approach of result.recommendedApproaches) {
      expect(approach.applicabilityScore).toBeGreaterThan(0.8);
      expect(approach.reasoning).toMatch(/過去|成功|実績|案件|効果/);
    }

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: expect.any(String),
        employeeCount: expect.any(Number),
        businessChallenge: expect.any(String),
      }),
      expect.objectContaining({
        budget: expect.any(Number),
        evaluationPeriodDays: expect.any(Number),
      })
    );
  });
});