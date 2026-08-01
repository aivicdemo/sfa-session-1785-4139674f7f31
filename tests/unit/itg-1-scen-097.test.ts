import { validateInferencePrerequisites } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-097
  test("成約実績の品質スコアが良好ライン直下の場合、推論実行が保留される", () => {
    const learningDataMinimum = 100;
    const learningDataActual = 150;
    const qualityScoreThreshold = 70;
    const qualityScoreActual = 65;
    const contractPerformanceQualityScore = 65;

    const input = {
      learningDataCount: learningDataActual,
      dataQualityScore: contractPerformanceQualityScore,
      qualityThreshold: qualityScoreThreshold,
      minimumLearningDataRequired: learningDataMinimum,
    };

    const result = validateInferencePrerequisites(input);

    expect(result.status).toBe("PENDING");
    expect(result.inferenceExecuted).toBe(false);
    expect(result.qualityScoreEvaluated).toBe(qualityScoreActual);
    expect(result.qualityThresholdValue).toBe(qualityScoreThreshold);
    expect(result.isBelowThreshold).toBe(true);
    expect(result.logMessage).toMatch(/Quality score 65 is below acceptable threshold 70/);
    expect(result.logMessage).toMatch(/Inference execution suspended/);
  });
});