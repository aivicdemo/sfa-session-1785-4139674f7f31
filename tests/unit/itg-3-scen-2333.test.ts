import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2333
  test('OpenAI API呼び出しが失敗し3回までの指数バックオフ再試行全て失敗するとき内部パターンマスタが使用される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.findSimilarPatterns.mockImplementation(async () => {
      callCount++;
      if (callCount <= 3) {
        throw new Error('Network error: API call failed');
      }
      return [];
    });

    const dealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      productCategory: 'software',
      dealAmount: 5000000,
      dealStage: 'negotiation',
      timeframe: 'Q2_2024',
    };

    const result = await findSimilarPatterns(
      dealCondition,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      patterns: [
        {
          patternId: 'PAT-001',
          patternName: 'Large Manufacturing Digital Transform',
          applicabilityScore: 0.95,
          description: 'Digital transformation approach for large manufacturing',
          source: 'internal_master',
        },
        {
          patternId: 'PAT-002',
          patternName: 'Software Enterprise License Expansion',
          applicabilityScore: 0.87,
          description: 'Enterprise license expansion for software solutions',
          source: 'internal_master',
        },
        {
          patternId: 'PAT-003',
          patternName: 'Manufacturing Process Automation',
          applicabilityScore: 0.82,
          description: 'Process automation for manufacturing sector',
          source: 'internal_master',
        },
        {
          patternId: 'PAT-004',
          patternName: 'Large Deal Negotiation Strategy',
          applicabilityScore: 0.79,
          description: 'Negotiation strategy for large-value deals',
          source: 'internal_master',
        },
        {
          patternId: 'PAT-005',
          patternName: 'Q2 Enterprise Sales Campaign',
          applicabilityScore: 0.76,
          description: 'Enterprise sales approach for Q2 period',
          source: 'internal_master',
        },
      ],
      userMessage:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      reasoning: {
        type: 'fallback',
        label: '内部マスタより',
        confidenceLevel: 'medium',
      },
      retryAttempts: 3,
      backoffConfig: {
        initialDelayMs: 1000,
        maxDelayMs: 4000,
        timeoutMs: 30000,
      },
    });

    expect(callCount).toBe(3);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);
  });
});