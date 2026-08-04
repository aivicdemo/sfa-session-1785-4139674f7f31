import { RecommendationReasonWeightClassifier } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1745: 根拠ウェイトが0.51のとき根拠優先度を高として分類する", () => {
    // Arrange
    const weightClassifier = new RecommendationReasonWeightClassifier();
    const testWeight = 0.51;
    const expectedPriority = "HIGH";

    // Act
    const result = weightClassifier.classifyPriorityByWeight(testWeight);

    // Assert
    expect(result.priority).toBe(expectedPriority);
    expect(result.weight).toBe(testWeight);
    expect(result.weight).toBeGreaterThan(0.5);
    expect(result.weight).toBeLessThanOrEqual(1.0);
  });
});