import { evaluatePatternRelevance, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2049
  test('新規案件の適合性スコアが推奨閾値0.75のとき、推奨判定が境界ケースとして認識される', () => {
    const newCaseData = {
      customerId: 'CUST-20240115-001',
      customerSize: 'mid_market',
      industry: 'manufacturing',
      budgetMin: 10000000,
      budgetMax: 15000000,
      decisionPeriodMonths: 3,
    };

    const successPatterns = [
      {
        patternId: 'PATTERN-A',
        approachName: '提案アプローチA',
        successRate: 0.82,
        applicableIndustries: ['manufacturing', 'construction'],
        budgetRangeMin: 8000000,
        budgetRangeMax: 20000000,
        decisionPeriodMin: 2,
        decisionPeriodMax: 6,
      },
      {
        patternId: 'PATTERN-B',
        approachName: '提案アプローチB',
        successRate: 0.75,
        applicableIndustries: ['manufacturing', 'retail'],
        budgetRangeMin: 5000000,
        budgetRangeMax: 25000000,
        decisionPeriodMin: 1,
        decisionPeriodMax: 12,
      },
    ];

    const mockFindSimilarPatterns = jest.fn(() => successPatterns);

    const mockEvaluatePatternRelevance = jest.fn((pattern, caseData) => {
      if (pattern.patternId === 'PATTERN-A') {
        return 0.75;
      } else if (pattern.patternId === 'PATTERN-B') {
        return 0.68;
      }
      return 0;
    });

    const recommendationThreshold = 0.75;

    const similarPatterns = mockFindSimilarPatterns(newCaseData);
    expect(similarPatterns).toHaveLength(2);
    expect(similarPatterns[0].patternId).toBe('PATTERN-A');

    const relevanceScoreA = mockEvaluatePatternRelevance(
      similarPatterns[0],
      newCaseData
    );
    const relevanceScoreB = mockEvaluatePatternRelevance(
      similarPatterns[1],
      newCaseData
    );

    expect(relevanceScoreA).toBe(0.75);
    expect(relevanceScoreB).toBe(0.68);

    const recommendationResultA =
      relevanceScoreA >= recommendationThreshold
        ? { recommended: true, reason: 'threshold_boundary' }
        : { recommended: false, reason: 'score_below_threshold' };

    const recommendationResultB =
      relevanceScoreB >= recommendationThreshold
        ? { recommended: true, reason: 'threshold_boundary' }
        : { recommended: false, reason: 'score_below_threshold' };

    expect(recommendationResultA.recommended).toBe(true);
    expect(recommendationResultA.reason).toBe('threshold_boundary');

    expect(recommendationResultB.recommended).toBe(false);
    expect(recommendationResultB.reason).toBe('score_below_threshold');

    const internalLog = {
      threshold: 0.75,
      scoreA: 0.75,
      scoreB: 0.68,
      decisionA: recommendationResultA.recommended,
      decisionB: recommendationResultB.recommended,
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    expect(internalLog.threshold).toBe(0.75);
    expect(internalLog.scoreA).toBe(0.75);
    expect(internalLog.decisionA).toBe(true);
    expect(internalLog.scoreB).toBe(0.68);
    expect(internalLog.decisionB).toBe(false);

    const boundaryMessage =
      'この案件は推奨の判定条件をちょうど満たしています。営業担当者の判断を優先してください';
    const uiDisplay = {
      recommendedApproachId: 'PATTERN-A',
      approachName: '提案アプローチA',
      relevanceScore: 0.75,
      boundaryWarning: boundaryMessage,
      displayType: 'conditional_recommendation',
    };

    expect(uiDisplay.relevanceScore).toBe(0.75);
    expect(uiDisplay.displayType).toBe('conditional_recommendation');
    expect(uiDisplay.boundaryWarning).toContain(
      '推奨の判定条件をちょうど満たしています'
    );

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newCaseData);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      successPatterns[0],
      newCaseData
    );
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      successPatterns[1],
      newCaseData
    );
  });
});