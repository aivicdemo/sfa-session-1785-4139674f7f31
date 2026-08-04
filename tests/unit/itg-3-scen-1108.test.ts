import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨エンジン呼び出し - OpenAI API連携', () => {
  // SCEN-1108
  test('OpenAI APIの再試行が3回目でも失敗したとき、代替パターンマスタからの推奨返却に切り替わる', async () => {
    const customerInput = {
      industry: 'manufacturing',
      companySize: 'mid-market',
      annualRevenue: 50000000,
      currentChallenge: 'supply_chain_optimization',
      dealStage: 'discovery',
      estimatedDealValue: 500000,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.generateRecommendation.mockImplementation(() => {
      callCount++;
      const error = new Error('API call timeout');
      (error as any).code = 'ETIMEDOUT';
      throw error;
    });

    const mockPatternMaster = [
      {
        patternId: 'PM-001',
        industry: 'manufacturing',
        companySize: 'mid-market',
        successCount: 145,
        totalCases: 200,
        successRate: 0.725,
        proposalApproach: 'Process automation focused on supply chain',
        keyValueProposition: 'Reduce lead time by 30%',
        estimatedROI: 0.35,
        implementationTimeline: '6 months',
      },
      {
        patternId: 'PM-002',
        industry: 'manufacturing',
        companySize: 'mid-market',
        successCount: 89,
        totalCases: 150,
        successRate: 0.593,
        proposalApproach: 'Cost reduction strategy',
        keyValueProposition: 'Reduce operational costs by 15%',
        estimatedROI: 0.20,
        implementationTimeline: '3 months',
      },
    ];

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendation(
      customerInput,
      mockAIEngine,
      mockPatternMaster,
      mockFileStorage
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(result.fallbackApplied).toBe(true);

    expect(result.recommendation).toEqual({
      patternId: 'PM-001',
      industry: 'manufacturing',
      companySize: 'mid-market',
      successCount: 145,
      totalCases: 200,
      successRate: 0.725,
      proposalApproach: 'Process automation focused on supply chain',
      keyValueProposition: 'Reduce lead time by 30%',
      estimatedROI: 0.35,
      implementationTimeline: '6 months',
    });

    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThan(0);

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.statusCode).toBe(200);

    expect(result.isSuccessResponse).toBe(true);

    expect(result.explanation).toMatch(/supply.chain|automation|lead.time/i);
  });
});