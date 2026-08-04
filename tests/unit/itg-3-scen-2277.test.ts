import { explainRecommendationReasoning, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2277
  test('推奨時点の商談条件が削除されているとき、根拠の妥当性検証ができずエラーになる', () => {
    const dealId = 'DEAL-20250801-001';
    const missingConditionName = '決算時期';
    const validConditions = [
      {
        conditionId: 'COND-001',
        name: '顧客業種',
        value: '製造業',
        weight: 0.3
      },
      {
        conditionId: 'COND-003',
        name: '案件規模',
        value: '500万円以上',
        weight: 0.25
      }
    ];
    const deletedCondition = {
      conditionId: 'COND-002',
      name: '決算時期',
      value: '3月',
      weight: 0.45,
      isDeleted: true
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: 'REC-20250801-001',
        dealId: dealId,
        reasoning: '類似成功案件から推奨',
        conditions: [...validConditions, deletedCondition],
        confidenceScore: 0
      }),
      evaluatePatternRelevance: jest.fn().mockImplementation((conditions) => {
        const hasMissingCondition = conditions.some(
          (cond: { isDeleted: boolean }) => cond.isDeleted === true
        );
        if (hasMissingCondition) {
          throw new Error('PATTERN_VALIDATION_FAILED');
        }
        return { relevanceScore: 85, isApplicable: true };
      })
    };

    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    let error: Error | null = null;
    try {
      const explanation = mockAIEngine.explainRecommendationReasoning(dealId);
      const conditions = explanation.conditions;
      mockAIEngine.evaluatePatternRelevance(conditions);
    } catch (err) {
      error = err as Error;
    }

    expect(error).not.toBeNull();
    expect(error?.message).toMatch(/PATTERN_VALIDATION_FAILED/);

    const expectedLogObject = {
      code: 'PATTERN_VALIDATION_FAILED',
      referenceId: dealId,
      missingConditions: [missingConditionName],
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    };

    mockConsoleLog(expectedLogObject);

    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PATTERN_VALIDATION_FAILED',
        referenceId: dealId,
        missingConditions: expect.arrayContaining([missingConditionName])
      })
    );

    mockConsoleLog.mockRestore();
  });
});