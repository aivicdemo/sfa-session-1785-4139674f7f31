import { evaluateAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-732: [normal] AIエージェント推論精度評価機能 - 顧客対応パターン分析が完了した状態での推論精度が正しく評価される
  test('顧客対応パターン分析が完了した状態で推論精度が正しく評価される', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-03-31T23:59:59Z');
    const totalResponseCount = 150;

    const customerSegmentationData = {
      correct: 130,
      total: 150,
    };

    const nextActionRecommendationData = {
      correct: 123,
      total: 150,
    };

    const priorityAssignmentData = {
      correct: 134,
      total: 150,
    };

    const inferencePatterns = [
      {
        patternId: 'segment_001',
        patternName: '新規顧客セグメント判定',
        correctCount: 25,
        totalCount: 28,
        confidenceScore: 0.892,
      },
      {
        patternId: 'segment_002',
        patternName: '既存顧客セグメント判定',
        correctCount: 105,
        totalCount: 122,
        confidenceScore: 0.861,
      },
      {
        patternId: 'action_001',
        patternName: 'フォローアップ推奨',
        correctCount: 95,
        totalCount: 110,
        confidenceScore: 0.864,
      },
      {
        patternId: 'action_002',
        patternName: '提案内容修正推奨',
        correctCount: 28,
        totalCount: 40,
        confidenceScore: 0.700,
      },
      {
        patternId: 'priority_001',
        patternName: '高優先度案件判定',
        correctCount: 80,
        totalCount: 85,
        confidenceScore: 0.941,
      },
      {
        patternId: 'priority_002',
        patternName: '中優先度案件判定',
        correctCount: 54,
        totalCount: 65,
        confidenceScore: 0.831,
      },
    ];

    const result = evaluateAiInferenceAccuracy({
      analysisStartDate,
      analysisEndDate,
      totalResponseCount,
      customerSegmentationData,
      nextActionRecommendationData,
      priorityAssignmentData,
      inferencePatterns,
    });

    expect(result).toBeDefined();
    expect(result.customerSegmentationAccuracy).toBe(86.67);
    expect(result.nextActionRecommendationAccuracy).toBe(82.0);
    expect(result.priorityAssignmentAccuracy).toBe(89.33);

    expect(result.overallAccuracy).toBe(86.0);

    expect(result.precisionScore).toBe(0.863);
    expect(result.recallScore).toBe(0.820);
    expect(result.f1Score).toBe(0.841);

    expect(result.inferencePatternDetails).toBeDefined();
    expect(result.inferencePatternDetails.length).toBe(6);

    const lowConfidencePatterns = result.inferencePatternDetails.filter(
      (pattern: { confidenceScore: number }) => pattern.confidenceScore < 0.75
    );
    expect(lowConfidencePatterns.length).toBe(1);
    expect(lowConfidencePatterns[0].patternId).toBe('action_002');

    expect(result.improvementSuggestions).toBeDefined();
    expect(result.improvementSuggestions.length).toBeGreaterThan(0);

    const actionPattern002Suggestion = result.improvementSuggestions.find(
      (suggestion: { targetPatternId: string }) =>
        suggestion.targetPatternId === 'action_002'
    );
    expect(actionPattern002Suggestion).toBeDefined();
    expect(actionPattern002Suggestion.suggestionText).toMatch(/提案内容修正推奨/);
    expect(actionPattern002Suggestion.priority).toMatch(/high|medium|low/i);
    expect(actionPattern002Suggestion.recommendedAction).toBeDefined();

    expect(result.evaluationTimestamp).toBeDefined();
    expect(typeof result.evaluationTimestamp).toBe('string');

    expect(result.confidenceDistribution).toBeDefined();
    expect(result.confidenceDistribution.veryHigh).toBe(1);
    expect(result.confidenceDistribution.high).toBe(3);
    expect(result.confidenceDistribution.medium).toBe(1);
    expect(result.confidenceDistribution.low).toBe(1);

    expect(result.analysisMetadata).toBeDefined();
    expect(result.analysisMetadata.analysisPeriod).toBe(
      '2024-01-01 to 2024-03-31'
    );
    expect(result.analysisMetadata.sampleSize).toBe(150);
    expect(result.analysisMetadata.patternCount).toBe(6);
  });
});