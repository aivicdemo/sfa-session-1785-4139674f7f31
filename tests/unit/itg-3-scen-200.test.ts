import { generateRecommendationWithJustification } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-200: 推奨内容に対して複数の根拠情報がすべて正常に可視化される", async () => {
    // Mock AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-001",
        recommendedApproach: "顧客の成長段階に応じた段階的提案アプローチ",
        confidenceScore: 85,
        justifications: [
          {
            justificationId: "R001",
            pastCaseId: "CASE-2024-001",
            pastCaseName: "A社向けクラウド移行プロジェクト",
            similarityScore: 92,
            applicabilityScore: 88,
          },
          {
            justificationId: "R002",
            pastCaseId: "CASE-2024-002",
            pastCaseName: "B社向けDX推進支援",
            similarityScore: 87,
            applicabilityScore: 85,
          },
          {
            justificationId: "R003",
            pastCaseId: "CASE-2024-003",
            pastCaseName: "C社向け業務効率化コンサル",
            similarityScore: 79,
            applicabilityScore: 76,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "P001",
          caseId: "CASE-2024-001",
          caseName: "A社向けクラウド移行プロジェクト",
          similarityScore: 92,
          applicabilityScore: 88,
        },
        {
          patternId: "P002",
          caseId: "CASE-2024-002",
          caseName: "B社向けDX推進支援",
          similarityScore: 87,
          applicabilityScore: 85,
        },
        {
          patternId: "P003",
          caseId: "CASE-2024-003",
          caseName: "C社向け業務効率化コンサル",
          similarityScore: 79,
          applicabilityScore: 76,
        },
      ]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValueOnce({
          justificationId: "R001",
          explanation:
            "顧客の業種が情報通信業で、かつ年間売上規模が10億円以上という条件が過去成功事例A社と完全に一致しています。提案タイミングも業界トレンドと合致しており、適用可能性が非常に高いです。",
        })
        .mockResolvedValueOnce({
          justificationId: "R002",
          explanation:
            "顧客の経営課題「DX推進」が過去事例B社と同様です。ただし顧客の決裁スタイルが異なるため、提案アプローチを若干カスタマイズする必要があります。",
        })
        .mockResolvedValueOnce({
          justificationId: "R003",
          explanation:
            "顧客の業務改善ニーズが過去事例C社と共通していますが、予算規模が異なるため、提案内容のスケーリングが必要です。基本的なアプローチは参考になります。",
        }),
    };

    const inputData = {
      customerId: "CUST-2024-100",
      customerName: "新規顧客D社",
      industry: "情報通信業",
      annualRevenue: 1200000000,
      businessChallenge: "DX推進と業務効率化",
      dealConditions: {
        expectedContractValue: 50000000,
        proposalDeadline: new Date("2024-02-15T23:59:59Z"),
        decisionMakerCount: 3,
      },
    };

    const result = await generateRecommendationWithJustification(
      inputData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe("REC-001");
    expect(result.recommendedApproach).toBe(
      "顧客の成長段階に応じた段階的提案アプローチ"
    );
    expect(result.confidenceScore).toBe(85);

    expect(result.justifications).toHaveLength(3);

    const justification1 = result.justifications[0];
    expect(justification1.justificationId).toBe("R001");
    expect(justification1.pastCaseName).toBe("A社向けクラウド移行プロジェクト");
    expect(justification1.similarityScore).toBe(92);
    expect(justification1.applicabilityScore).toBe(88);
    expect(justification1.explanation).toContain("業種が情報通信業");
    expect(justification1.explanation).toContain("完全に一致");

    const justification2 = result.justifications[1];
    expect(justification2.justificationId).toBe("R002");
    expect(justification2.pastCaseName).toBe("B社向けDX推進支援");
    expect(justification2.similarityScore).toBe(87);
    expect(justification2.applicabilityScore).toBe(85);
    expect(justification2.explanation).toContain("提案アプローチを");
    expect(justification2.explanation).toContain("カスタマイズ");

    const justification3 = result.justifications[2];
    expect(justification3.justificationId).toBe("R003");
    expect(justification3.pastCaseName).toBe("C社向け業務効率化コンサル");
    expect(justification3.similarityScore).toBe(79);
    expect(justification3.applicabilityScore).toBe(76);
    expect(justification3.explanation).toContain("予算規模が異なる");

    const justificationIds = result.justifications.map(
      (j) => j.justificationId
    );
    expect(justificationIds).toEqual(["R001", "R002", "R003"]);

    const similarityScores = result.justifications.map(
      (j) => j.similarityScore
    );
    expect(similarityScores).toEqual([92, 87, 79]);
    for (let i = 0; i < similarityScores.length - 1; i++) {
      expect(similarityScores[i]).toBeGreaterThanOrEqual(similarityScores[i + 1]);
    }

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST-2024-100",
        customerName: "新規顧客D社",
      })
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(
      mockAIEngine.explainRecommendationReasoning
    ).toHaveBeenNthCalledWith(1, "R001");
    expect(
      mockAIEngine.explainRecommendationReasoning
    ).toHaveBeenNthCalledWith(2, "R002");
    expect(
      mockAIEngine.explainRecommendationReasoning
    ).toHaveBeenNthCalledWith(3, "R003");

    expect(result.justifications.every((j) => j.explanation)).toBe(true);
    expect(
      result.justifications.every((j) => j.explanation.length > 0)
    ).toBe(true);
  });
});