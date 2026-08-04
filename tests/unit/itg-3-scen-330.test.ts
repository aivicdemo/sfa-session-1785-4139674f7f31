import { verifyRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-330: 推奨精度検証機能 - 検証対象の過去推奨履歴が0件の場合、検証結果として計測不可が報告される", async () => {
    // Arrange
    const mockRecommendationEngine = {
      findRecommendationHistory: jest.fn().mockResolvedValue([]),
      evaluateRecommendationAccuracy: jest.fn(),
    };

    const verificationInput = {
      userId: "user-001",
      targetPeriodDays: 30,
    };

    // Act
    const result = await verifyRecommendationAccuracy(
      verificationInput,
      mockRecommendationEngine
    );

    // Assert
    expect(result.status).toBe("UNMEASURABLE");
    expect(result.reasonCode).toBe("NO_RECOMMENDATION_HISTORY");
    expect(result.message).toContain("過去推奨履歴がないため、精度を計測できません");
    expect(result.accuracy).toBeNull();
    expect(result.sampleCount).toBe(0);
    expect(mockRecommendationEngine.findRecommendationHistory).toHaveBeenCalledWith(
      verificationInput.userId,
      verificationInput.targetPeriodDays
    );
    expect(mockRecommendationEngine.evaluateRecommendationAccuracy).not.toHaveBeenCalled();
  });
});