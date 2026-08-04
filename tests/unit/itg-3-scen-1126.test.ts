import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1126
  test('過去成功商談が0件のとき、推奨パターンマスタから統計上位パターンを返却する', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-001',
          successRate: 90,
          applicableConditions: {
            industry: 'IT',
            minRevenue: 10000000,
            maxRevenue: 100000000,
          },
          proposalApproach: 'デジタル化推進による業務効率化提案',
          targetRole: 'CTO',
          averageDealCycle: 90,
          metadata: {
            frequency: 45,
            lastUpdated: '2024-01-15T00:00:00Z',
          },
        },
        {
          patternId: 'PATTERN-002',
          successRate: 85,
          applicableConditions: {
            industry: 'IT',
            minRevenue: 10000000,
            maxRevenue: 100000000,
          },
          proposalApproach: 'クラウド移行コスト削減提案',
          targetRole: 'CFO',
          averageDealCycle: 75,
          metadata: {
            frequency: 38,
            lastUpdated: '2024-01-15T00:00:00Z',
          },
        },
        {
          patternId: 'PATTERN-003',
          successRate: 80,
          applicableConditions: {
            industry: 'IT',
            minRevenue: 10000000,
            maxRevenue: 100000000,
          },
          proposalApproach: 'セキュリティ強化による信頼構築提案',
          targetRole: 'CISO',
          averageDealCycle: 60,
          metadata: {
            frequency: 32,
            lastUpdated: '2024-01-15T00:00:00Z',
          },
        },
      ]),
    };

    const input = {
      customerId: 'TEST-CUST-001',
      industry: 'IT',
      revenueScale: 10000000,
      aiEngine: mockAIEngine,
      patternRepository: mockPatternRepository,
    };

    const result = await extractSuccessPatterns(input);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith({
      customerId: 'TEST-CUST-001',
      industry: 'IT',
      revenueScale: 10000000,
    });

    expect(mockPatternRepository.getTopSuccessPatterns).toHaveBeenCalledWith({
      industry: 'IT',
      revenueScale: 10000000,
      limit: 3,
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      patternId: 'PATTERN-001',
      successRate: 90,
      applicableConditions: {
        industry: 'IT',
        minRevenue: 10000000,
        maxRevenue: 100000000,
      },
      proposalApproach: 'デジタル化推進による業務効率化提案',
      targetRole: 'CTO',
      averageDealCycle: 90,
      metadata: {
        frequency: 45,
        lastUpdated: '2024-01-15T00:00:00Z',
      },
    });

    expect(result[1]).toEqual({
      patternId: 'PATTERN-002',
      successRate: 85,
      applicableConditions: {
        industry: 'IT',
        minRevenue: 10000000,
        maxRevenue: 100000000,
      },
      proposalApproach: 'クラウド移行コスト削減提案',
      targetRole: 'CFO',
      averageDealCycle: 75,
      metadata: {
        frequency: 38,
        lastUpdated: '2024-01-15T00:00:00Z',
      },
    });

    expect(result[2]).toEqual({
      patternId: 'PATTERN-003',
      successRate: 80,
      applicableConditions: {
        industry: 'IT',
        minRevenue: 10000000,
        maxRevenue: 100000000,
      },
      proposalApproach: 'セキュリティ強化による信頼構築提案',
      targetRole: 'CISO',
      averageDealCycle: 60,
      metadata: {
        frequency: 32,
        lastUpdated: '2024-01-15T00:00:00Z',
      },
    });

    expect(result[0].successRate).toBe(90);
    expect(result[1].successRate).toBe(85);
    expect(result[2].successRate).toBe(80);
  });
});