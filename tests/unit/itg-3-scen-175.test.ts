import { evaluateInferenceExecutionAndHoldIfDataInsufficient } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-175: [edge] 学習データ検証と推論実行判定の統合機能 - データ量が最小要件直下で品質スコアが合格ライン直上の場合に推論が保留される
  test('should hold inference execution when training data count is below minimum threshold despite quality score being above acceptable line', () => {
    const minimumDataCount = 100;
    const qualityScoreThreshold = 0.75;
    const trainingDataCount = 99;
    const qualityScore = 0.751;
    const dealId = 'DEAL-001';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(qualityScore),
    };

    const result = evaluateInferenceExecutionAndHoldIfDataInsufficient(
      {
        minimumDataCountRequirement: minimumDataCount,
        qualityScoreAcceptableThreshold: qualityScoreThreshold,
        trainingDataCount,
        qualityScore,
        dealId,
      },
      mockAIRecommendationEngine,
    );

    expect(result.inferenceStatus).toBe('HELD');
    expect(result.shouldExecuteInference).toBe(false);
    expect(result.holdReason).toMatch(/99/);
    expect(result.holdReason).toMatch(/100/);
    expect(result.holdReason).toMatch(/0\.75/);
    expect(result.holdReason).toMatch(/0\.751/);
    expect(result.holdReason).toMatch(/データ量/);
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});