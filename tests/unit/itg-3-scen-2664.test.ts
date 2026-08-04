import { evaluateCustomerAttributeCompleteness } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 顧客属性欠落時の処理', () => {
  // SCEN-2664
  test('顧客属性が欠落しているとき、判定不可として処理される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const incompletePriorCustomerAttributes = {
      industry: 'IT',
      companyScale: 'large',
      purchaseDecisionMaker: 'CTO',
    };

    const logRecords: string[] = [];
    const originalLog = console.log;
    console.log = jest.fn((msg: string) => {
      logRecords.push(msg);
    });

    const result = evaluateCustomerAttributeCompleteness(
      incompletePriorCustomerAttributes,
      mockAIEngine
    );

    console.log = originalLog;

    expect(result).toEqual({
      status: 400,
      errorCode: 'MISSING_CUSTOMER_ATTRIBUTES',
      missingAttributes: ['budgetRange'],
      message: 'Required customer attributes are missing.',
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    const logsWithMissing = logRecords.filter((log) =>
      log.includes('欠落属性:')
    );
    expect(logsWithMissing.length).toBeGreaterThan(0);
    expect(logsWithMissing[0]).toMatch(/budgetRange/);
  });
});