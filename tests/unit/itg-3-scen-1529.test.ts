import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理", () => {
  // SCEN-1529
  test("一致度スコアが閾値より直下の場合、その顧客は特定対象に除外される", () => {
    const threshold = 0.70;
    const belowThresholdScore = 0.69;
    const aboveThresholdScore = 0.71;

    const newProjectData = {
      customerId: "CUST-NEW-001",
      industry: "IT",
      companySize: "medium",
      dealAmount: 5000000,
      dealStage: "proposal",
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((customerId, projectData) => {
        if (customerId === "CUST-SIMILAR-BELOW") {
          return belowThresholdScore;
        }
        if (customerId === "CUST-SIMILAR-ABOVE") {
          return aboveThresholdScore;
        }
        return 0;
      }),
    };

    const result = findSimilarPatterns(newProjectData, mockAIEngine, threshold);

    const belowThresholdCustomer = result.find(
      (customer) => customer.customerId === "CUST-SIMILAR-BELOW"
    );
    const aboveThresholdCustomer = result.find(
      (customer) => customer.customerId === "CUST-SIMILAR-ABOVE"
    );

    expect(belowThresholdCustomer).toBeUndefined();
    expect(aboveThresholdCustomer).toBeDefined();
    expect(aboveThresholdCustomer?.matchingScore).toBe(aboveThresholdScore);
  });
});