import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { getRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化 - AI失敗時のフォールバック', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // SCEN-773
  test('AIRecommendationEngine失敗時、キャッシュされた統計上位パターンが代替表示される', async () => {
    const customerId = 'CUST-00123';
    const dealData = {
      industry: 'manufacturing',
      companySize: 'large',
      annualRevenue: 50000000,
      challengeType: 'cost_optimization',
      budget: 5000000,
      timeline: '2024-Q2'
    };

    const mockAIEngineStub = {
      generateRecommendation: async () => {
        throw new Error('OpenAI API network error');
      },
      findSimilarPatterns: async () => [],
      explainRecommendationReasoning: async () => '',
      evaluatePatternRelevance: async () => 0
    };

    const cachedTopPatterns = [
      {
        patternId: 'PAT-MFG-001',
        industry: 'manufacturing',
        approachType: 'cost_reduction_proposal',
        successRate: 0.82,
        applicableCount: 47,
        description: 'コスト削減提案パターン（大規模製造業向け）',
        keyActions: ['現状分析', 'ROI試算', '段階実行計画'],
        rank: 1
      },
      {
        patternId: 'PAT-MFG-002',
        industry: 'manufacturing',
        approachType: 'digital_transformation',
        successRate: 0.76,
        applicableCount: 33,
        description: 'デジタル化推進パターン（大規模製造業向け）',
        keyActions: ['現状診断', 'ロードマップ作成', 'POC提案'],
        rank: 2
      },
      {
        patternId: 'PAT-MFG-003',
        industry: 'manufacturing',
        approachType: 'supply_chain_optimization',
        successRate: 0.71,
        applicableCount: 28,
        description: 'サプライチェーン最適化パターン（大規模製造業向け）',
        keyActions: ['現状把握', '改善案提示', '実装支援'],
        rank: 3
      }
    ];

    const response = await getRecommendation(
      customerId,
      dealData,
      mockAIEngineStub,
      cachedTopPatterns
    );

    expect(response.status).toBe('cached');
    expect(response.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(response.recommendation).toBeDefined();
    expect(Array.isArray(response.recommendation.patterns)).toBe(true);
    expect(response.recommendation.patterns.length).toBe(3);
    expect(response.recommendation.patterns[0].patternId).toBe('PAT-MFG-001');
    expect(response.recommendation.patterns[0].successRate).toBe(0.82);
    expect(response.recommendation.patterns[0].applicableCount).toBeGreaterThanOrEqual(1);
    expect(response.recommendation.patterns[1].patternId).toBe('PAT-MFG-002');
    expect(response.recommendation.patterns[2].patternId).toBe('PAT-MFG-003');
    expect(response.reasoning).toBeDefined();
    expect(typeof response.reasoning).toBe('string');
    expect(response.reasoning.length).toBeGreaterThan(0);
    expect(response.reasoning.length).toBeLessThan(500);
  });
});