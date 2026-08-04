import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

interface ProposalInput {
  proposalAmount: number;
  customerAnnualRevenue: number;
  implementationCost: number;
  expectedEffect: number;
}

interface FeasibilityResult {
  roiValue: number | null;
  roiCalculable: boolean;
  constraintMessage: string;
  recommendationContext: {
    proposalAmountZero: boolean;
  };
}

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock<Promise<{
    message: string;
    constraints: string[];
  }>>;
}

describe("AIエージェント推奨根拠の可視化機能 - 提案金額ゼロ時のROI計算", () => {
  test("SCEN-1328: 提案金額が0のとき、ROI計算が適切に処理される", async () => {
    // Arrange
    const proposalInput: ProposalInput = {
      proposalAmount: 0,
      customerAnnualRevenue: 10000000,
      implementationCost: 1000000,
      expectedEffect: 2000000,
    };

    const aiEngineStub: AIRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        message:
          "提案金額が0のため、ROI指標による自動比較ができません。顧客制約条件を確認してください。",
        constraints: ["proposalAmount_zero"],
      }),
    };

    const expectedRoiValue = -1;
    const expectedCalculable = false;
    const expectedConstraintMessageKeyword = "提案金額が0";
    const expectedProposalAmountZeroFlag = true;

    // Act
    const result: FeasibilityResult = await evaluateProposalFeasibility(
      proposalInput,
      aiEngineStub
    );

    // Assert
    expect(result.roiValue).toBe(expectedRoiValue);
    expect(result.roiCalculable).toBe(expectedCalculable);
    expect(result.constraintMessage).toContain(expectedConstraintMessageKeyword);
    expect(result.recommendationContext.proposalAmountZero).toBe(
      expectedProposalAmountZeroFlag
    );

    expect(result.roiValue).not.toBe(null);
    expect(result.roiValue).not.toBe(undefined);
    expect(Number.isNaN(result.roiValue)).toBe(false);
    expect(Number.isFinite(result.roiValue) || result.roiValue === -1).toBe(
      true
    );

    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalAmount: 0,
        constraints: expect.arrayContaining(["proposalAmount_zero"]),
      })
    );
  });
});