import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1377
  test('[error] AIRecommendationEngine.findSimilarPatterns失敗時に内部推奨パターンマスタから返却する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.findSimilarPatterns.mockImplementation(async () => {
      callCount++;
      if (callCount <= 3) {
        const error = new Error('API timeout');
        (error as any).code = 'ECONNABORTED';
        throw error;
      }
      return [];
    });

    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'IT',
      dealAmount: 5000000,
      competitorInfo: true,
      dealStage: '提案準備',
      customerScale: '中堅企業',
    };

    const internalPatternMaster = [
      {
        patternId: 'PAT-IT-001',
        industry: 'IT',
        minAmount: 4000000,
        maxAmount: 10000000,
        approachName: '機能拡張型提案',
        successRate: 0.82,
        description: 'IT業界向けの機能拡張を軸とした提案手法',
        relatedSuccessExamples: [
          { caseId: 'CASE-2023-0145', dealAmount: 5500000, successRate: 0.85 },
          { caseId: 'CASE-2023-0089', dealAmount: 4800000, successRate: 0.80 },
          { caseId: 'CASE-2023-0201', dealAmount: 6200000, successRate: 0.88 },
        ],
      },
      {
        patternId: 'PAT-IT-002',
        industry: 'IT',
        minAmount: 4000000,
        maxAmount: 10000000,
        approachName: 'コスト最適化型提案',
        successRate: 0.79,
        description: 'IT企業のコスト削減を主軸とした提案アプローチ',
        relatedSuccessExamples: [
          { caseId: 'CASE-2023-0156', dealAmount: 5100000, successRate: 0.81 },
          { caseId: 'CASE-2023-0198', dealAmount: 4900000, successRate: 0.78 },
        ],
      },
      {
        patternId: 'PAT-IT-003',
        industry: 'IT',
        minAmount: 4000000,
        maxAmount: 10000000,
        approachName: 'リスク低減型提案',
        successRate: 0.81,
        description: 'セキュリティおよびリスク対策を重視した提案手法',
        relatedSuccessExamples: [
          { caseId: 'CASE-2023-0167', dealAmount: 5700000, successRate: 0.83 },
          { caseId: 'CASE-2023-0234', dealAmount: 6000000, successRate: 0.82 },
        ],
      },
    ];

    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      internalPatternMaster,
    );

    expect(callCount).toBe(3);
    expect(result).toHaveProperty('fallbackMode', true);
    expect(result).toHaveProperty(
      'userMessage',
      expect.stringContaining('推奨の生成に一時的な遅延が発生しています'),
    );
    expect(result).toHaveProperty(
      'userMessage',
      expect.stringContaining('過去の推奨履歴から類似案件を表示します'),
    );

    expect(result.recommendedApproaches).toBeDefined();
    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.recommendedApproaches.length).toBeGreaterThanOrEqual(3);

    const topApproaches = result.recommendedApproaches.slice(0, 3);
    expect(topApproaches[0]).toHaveProperty('patternId', 'PAT-IT-001');
    expect(topApproaches[0]).toHaveProperty('approachName', '機能拡張型提案');
    expect(topApproaches[0]).toHaveProperty('successRate', 0.82);
    expect(topApproaches[0]).toHaveProperty('reasoning', expect.any(String));
    expect(topApproaches[0].reasoning).not.toContain('GPT');
    expect(topApproaches[0].reasoning).toContain('機能拡張を軸とした提案手法');

    expect(topApproaches[1]).toHaveProperty('patternId', 'PAT-IT-003');
    expect(topApproaches[1]).toHaveProperty('approachName', 'リスク低減型提案');
    expect(topApproaches[1]).toHaveProperty('successRate', 0.81);

    expect(topApproaches[2]).toHaveProperty('patternId', 'PAT-IT-002');
    expect(topApproaches[2]).toHaveProperty('approachName', 'コスト最適化型提案');
    expect(topApproaches[2]).toHaveProperty('successRate', 0.79);

    topApproaches.forEach((approach) => {
      expect(approach.successRate).toBeGreaterThanOrEqual(0.8);
      expect(approach.relatedSuccessExamples).toBeDefined();
      expect(Array.isArray(approach.relatedSuccessExamples)).toBe(true);
      expect(approach.relatedSuccessExamples.length).toBeGreaterThan(0);
    });

    expect(result).toHaveProperty('retryAttempts', 3);
    expect(result).toHaveProperty('aiEngineAvailable', false);
  });
});