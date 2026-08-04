import { calculateDeviationFromStandardProcess } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2107
  test("顧客対応パターンデータが空配列のとき、エラーが発生する", () => {
    const proposalContent = {
      proposalId: "PROP-001",
      customerId: "CUST-001",
      proposedApproach: "Solution A",
      targetAmount: 500000,
      proposedTimeline: "Q2 2024",
    };

    const customerInteractionPatterns: Array<{
      interactionDate: string;
      actionType: string;
      result: string;
    }> = [];

    const standardProcessDefinition = {
      processSteps: [
        {
          stepId: "STEP-001",
          stepName: "Initial Contact",
          expectedAction: "Call",
          successCriteria: "Contact established",
        },
        {
          stepId: "STEP-002",
          stepName: "Needs Analysis",
          expectedAction: "Meeting",
          successCriteria: "Requirements documented",
        },
      ],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      calculateDeviationFromStandardProcess(
        proposalContent,
        customerInteractionPatterns,
        standardProcessDefinition,
        mockAIEngine
      )
    ).toThrow(/顧客対応パターン/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});