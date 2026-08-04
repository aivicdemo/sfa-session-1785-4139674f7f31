import { calculateDataQualityScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("データ品質スコア算出機能", () => {
  test("SCEN-523: エラー率がちょうど上限100%のときスコアが最低値0になる", () => {
    // Arrange
    const totalProcessedItems = 10;
    const totalErrorItems = 10;
    const errorRate = 1.0; // 100%

    // Act
    const qualityScore = calculateDataQualityScore({
      totalProcessedItems,
      totalErrorItems,
      errorRate,
    });

    // Assert
    expect(qualityScore).toBe(0);
  });
});