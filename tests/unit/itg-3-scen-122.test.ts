import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - APIレスポンスのJSON形式が不正な場合の推論結果パース失敗対応', () => {
  test('SCEN-122: APIレスポンスが不正なJSON形式の場合、代替パターンを表示して正常に処理を継続する', async () => {
    const malformedJsonResponse = '{"recommendation": "test"';

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(malformedJsonResponse),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE-001',
          customerId: 'CUST-A',
          industry: 'IT',
          companySize: 'large',
          budget: 5000000,
          successRate: 0.92,
          pattern: 'high-value-account'
        },
        {
          caseId: 'CASE-002',
          customerId: 'CUST-B',
          industry: 'IT',
          companySize: 'medium',
          budget: 3000000,
          successRate: 0.85,
          pattern: 'mid-market-growth'
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('代替パターンの簡略説明'),
      evaluatePatternRelevance: jest.fn()
    };

    const newCaseData = {
      customerName: '新規顧客XYZ',
      industry: 'IT',
      companySize: 'large',
      budget: 4800000,
      dealStage: 'proposal',
      timeline: 'Q1-2025'
    };

    const result = await generateRecommendation(newCaseData, mockAIEngine);

    expect(result.success).toBe(false);
    expect(result.errorType).toBe('JSON_PARSE_ERROR');
    expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(result.internalLog).toMatch(/APIレスポンスのパース失敗/);
    expect(result.fallbackPatterns).toEqual([
      {
        caseId: 'CASE-001',
        customerId: 'CUST-A',
        industry: 'IT',
        companySize: 'large',
        budget: 5000000,
        successRate: 0.92,
        pattern: 'high-value-account'
      },
      {
        caseId: 'CASE-002',
        customerId: 'CUST-B',
        industry: 'IT',
        companySize: 'medium',
        budget: 3000000,
        successRate: 0.85,
        pattern: 'mid-market-growth'
      }
    ]);
    expect(result.fallbackExplanation).toBe('代替パターンの簡略説明');
    expect(result.systemHealthy).toBe(true);
  });
});