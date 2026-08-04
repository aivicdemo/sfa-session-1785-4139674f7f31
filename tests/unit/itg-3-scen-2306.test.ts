import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2306: 異常パターン検出スコアが閾値直上のとき異常判定される', () => {
    const threshold = 0.7;
    const detectionScore = 0.700001;
    const toleranceMargin = 0.000001;

    const customerPattern = {
      proposalContent: {
        targetIndustry: 'IT',
        companySize: 'large',
        proposedSolution: 'Digital Transformation',
        estimatedBudget: 5000000,
      },
      historicalPattern: {
        pastSuccessRate: 0.75,
        similarCaseCount: 12,
        averageClosurePeriod: 45,
      },
      standardProcessDeviation: {
        stepsMissed: [],
        timelineDeviation: 5,
        approvalSequenceVariation: false,
      },
    };

    const result = evaluatePatternRelevance(
      customerPattern,
      threshold,
      detectionScore
    );

    expect(result.isAnomalyDetected).toBe(true);
    expect(result.detectionScore).toBe(detectionScore);
    expect(result.thresholdValue).toBe(threshold);
    expect(result.anomalyClassification).toBe('標準プロセスから逸脱した異常パターン');
    expect(result.judgmentReason).toMatch(/パターン適用可能性スコア:\s*0\.700001/);
    expect(result.judgmentReason).toMatch(/判定閾値\s*0\.7\s*を超過/);
    expect(result.marginFromThreshold).toBeLessThanOrEqual(toleranceMargin);
    expect(result.hasReasoningExplanation).toBe(true);
    expect(typeof result.reasoningExplanation).toBe('string');
    expect(result.reasoningExplanation.length).toBeGreaterThan(0);
  });
});