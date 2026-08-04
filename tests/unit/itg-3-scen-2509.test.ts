import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能 - 権限エラーハンドリング', () => {
  // SCEN-2509
  test('営業部長権限が確認できないときテンプレート生成がエラーになる', async () => {
    const userId = 'user-001';
    const userRole = 'sales_representative';
    const requiredRole = 'sales_director';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      validateUserAuthorization: jest.fn().mockResolvedValue({
        isAuthorized: false,
        requiredRole: requiredRole,
        userRole: userRole,
        errorCode: 'INSUFFICIENT_PERMISSION',
      }),
    };

    const mockOperationLogger = {
      logOperation: jest.fn().mockResolvedValue({
        operationId: 'op-001',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      }),
    };

    const testInput = {
      userId: userId,
      userRole: userRole,
      successCriteria: {
        customerIndustry: 'technology',
        dealSize: 5000000,
        salesCycleLength: 90,
      },
      templateDesignContext: {
        successFactors: ['early_stakeholder_alignment', 'technical_fit_validation'],
        failureFactors: ['scope_creep', 'budget_constraint'],
      },
    };

    let capturedError: any = null;
    let operationLogCaptured: any = null;

    try {
      await generateSuccessPatternTemplate(
        testInput,
        mockAIRecommendationEngine,
        mockOperationLogger
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toMatch(/営業部長権限/);
    expect(capturedError.code).toBe('INSUFFICIENT_PERMISSION');
    expect(capturedError.statusCode).toBe(403);

    expect(mockOperationLogger.logOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: userId,
        action: 'TemplateGeneration',
        status: 'FAILED',
        reason: 'PERMISSION_DENIED',
        roleAttempted: userRole,
        roleRequired: requiredRole,
      })
    );

    const logCall = mockOperationLogger.logOperation.mock.calls[0][0];
    expect(logCall.userId).toBe('user-001');
    expect(logCall.action).toBe('TemplateGeneration');
    expect(logCall.status).toBe('FAILED');
    expect(logCall.reason).toBe('PERMISSION_DENIED');
  });
});