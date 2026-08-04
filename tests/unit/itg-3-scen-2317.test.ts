import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 商談条件データ欠落時の処理中断', () => {
  // SCEN-2317
  test('商談条件の必須フィールドが欠落している場合、照合処理が中断され DATA_VALIDATION_FAILED エラーを返す', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const incompleteNewProject = {
      projectId: 'proj-001',
      customerName: 'Acme Corp',
      productCategory: null,
      budget: 5000000,
      decisionTimeline: undefined,
    };

    const systemLogCapture: Array<{
      level: string;
      message: string;
      timestamp: string;
    }> = [];

    const mockLogger = {
      info: jest.fn((msg: string) => {
        systemLogCapture.push({
          level: 'INFO',
          message: msg,
          timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
        });
      }),
      error: jest.fn((msg: string) => {
        systemLogCapture.push({
          level: 'ERROR',
          message: msg,
          timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
        });
      }),
    };

    const result = await generateRecommendation(
      incompleteNewProject,
      mockAIEngine,
      mockLogger
    );

    expect(result.status).toBe('DATA_VALIDATION_FAILED');
    expect(result.errorMessage).toMatch(/productCategory|decisionTimeline/);
    expect(result.errorMessage).toContain('欠落フィールド');
    expect(result.errorMessage).toContain('proj-001');

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    const validationErrorLog = systemLogCapture.find(
      (log) =>
        log.level === 'ERROR' &&
        log.message.includes('商談条件データ検証失敗')
    );
    expect(validationErrorLog).toBeDefined();
    expect(validationErrorLog?.message).toContain('欠落フィールド=');
    expect(validationErrorLog?.message).toContain('案件ID=proj-001');
  });
});