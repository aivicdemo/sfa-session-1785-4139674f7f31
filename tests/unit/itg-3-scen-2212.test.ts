import { generateRecommendation, explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化 - 接触タイミング乖離の最大値適用", () => {
  // SCEN-2212
  test("顧客対応の接触タイミングが成功パターンより極端に遅い場合、タイミング乖離の最大値が適用され推奨信頼度が低下する", async () => {
    const initialContactDate = new Date("2024-01-01");
    const finalContactDate = new Date("2024-04-30");
    const contactDurationDays = 120;
    const standardSuccessPatternDays = 30;
    const timingDeviationDays = contactDurationDays - standardSuccessPatternDays;
    const monthlyMaxDeviation = 90;
    const expectedRelevanceScore = 0.45;
    const expectedConfidenceScore = 35;

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "success_pattern_001",
          customerId: "cust_12345",
          initialToContractDays: standardSuccessPatternDays,
          successRate: 0.92,
          industry: "IT",
          companySize: "mid",
          productCategory: "cloud_solution",
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: expectedRelevanceScore,
        timingDeviationScore: timingDeviationDays,
        monthlyMaxDeviationApplied: true,
        riskFactors: ["timing_deviation_critical"],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "接触タイミングが標準パターンから大幅に遅延しているため、推奨の信頼度が低下しています。" +
          "標準的な成功パターンでは初回接触から契約までが30日以内に完了しますが、" +
          "本案件では120日を要しており、90日の遅延が月単位の最大許容値に達しています。"
      ),
    };

    const customerData = {
      customerId: "cust_12345",
      customerName: "Sample Corp",
      industry: "IT",
      companySize: "mid",
      estimatedAnnualRevenue: 50000000,
    };

    const dealData = {
      dealId: "deal_67890",
      customerId: "cust_12345",
      initialContactDate: "2024-01-01",
      finalContactDate: "2024-04-30",
      proposalContent: "Cloud infrastructure modernization",
      estimatedContractValue: 5000000,
      contactPatterns: [
        {
          contactSequence: 1,
          contactDate: "2024-01-01",
          contactType: "initial_inquiry",
        },
        {
          contactSequence: 2,
          contactDate: "2024-02-15",
          contactType: "follow_up_meeting",
        },
        {
          contactSequence: 3,
          contactDate: "2024-04-30",
          contactType: "contract_negotiation",
        },
      ],
    };

    const recommendationResult = await generateRecommendation(customerData, dealData, mockAIRecommendationEngine);

    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.recommendationId).toBeDefined();
    expect(recommendationResult.dealId).toBe("deal_67890");
    expect(recommendationResult.confidenceScore).toBeLessThanOrEqual(expectedConfidenceScore);
    expect(recommendationResult.relevanceScore).toBeLessThanOrEqual(expectedRelevanceScore);

    const reasoningExplanation = await explainRecommendationReasoning(
      recommendationResult.recommendationId,
      mockAIRecommendationEngine
    );

    expect(reasoningExplanation).toBeDefined();
    expect(reasoningExplanation).toContain("接触タイミング");
    expect(reasoningExplanation).toContain("大幅に遅延");
    expect(reasoningExplanation).toContain("信頼度が低下");
    expect(reasoningExplanation).toContain("90日");
    expect(reasoningExplanation).toContain("最大許容値");

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();

    const evaluationCall = mockAIRecommendationEngine.evaluatePatternRelevance.mock.calls[0];
    expect(evaluationCall).toBeDefined();
    const evaluationResult = await mockAIRecommendationEngine.evaluatePatternRelevance(
      evaluationCall[0],
      evaluationCall[1]
    );
    expect(evaluationResult.relevanceScore).toBeLessThanOrEqual(0.5);
    expect(evaluationResult.monthlyMaxDeviationApplied).toBe(true);
    expect(evaluationResult.riskFactors).toContain("timing_deviation_critical");
  });
});