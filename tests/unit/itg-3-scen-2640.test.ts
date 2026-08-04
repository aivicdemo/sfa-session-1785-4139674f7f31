import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨生成機能 - 外部API失敗時の代替動作', () => {
  let mockEngineStub: any;
  let mockLogger: any;
  const testPatterns = [
    {
      patternId: 'PAT-001',
      successRate: 95,
      industry: 'IT',
      proposalApproach: 'SaaS導入支援',
      rationale: '類似案件の成約率が高い',
    },
    {
      patternId: 'PAT-002',
      successRate: 88,
      industry: 'IT',
      proposalApproach: 'オンプレミス導入',
      rationale: '対象顧客層の実装実績が豊富',
    },
    {
      patternId: 'PAT-003',
      successRate: 92,
      industry: '金融',
      proposalApproach: 'コンプライアンス強化提案',
      rationale: '業界要件への適合性が確認済み',
    },
  ];

  beforeEach(() => {
    mockLogger = {
      logs: [] as string[],
      info: function (message: string) {
        this.logs.push(`INFO: ${message}`);
      },
      error: function (message: string) {
        this.logs.push(`ERROR: ${message}`);
      },
    };

    mockEngineStub = {
      callCount: 0,
      generateRecommendation: async function () {
        this.callCount += 1;
        const error = new Error('OpenAI API timeout');
        (error as any).code = 'ETIMEDOUT';
        throw error;
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2640
  test('外部API呼び出し失敗時に内部推奨パターンマスタから代替結果を返却する', async () => {
    const newCaseInput = {
      customerIndustry: 'IT',
      dealSize: '大',
      budget: '5000万円',
    };

    const result = await generateRecommendationWithFallback(
      newCaseInput,
      mockEngineStub,
      testPatterns,
      mockLogger
    );

    expect(result.statusCode).toBe(200);
    expect(result.body.recommendationSource).toBe('internal_pattern_master');
    expect(Array.isArray(result.body.recommendations)).toBe(true);
    expect(result.body.recommendations.length).toBe(2);

    const firstRecommendation = result.body.recommendations[0];
    expect(firstRecommendation.patternId).toBe('PAT-001');
    expect(firstRecommendation.successRate).toBe(95);
    expect(firstRecommendation.proposalApproach).toBe('SaaS導入支援');
    expect(firstRecommendation.rationale).toBe('類似案件の成約率が高い');

    const secondRecommendation = result.body.recommendations[1];
    expect(secondRecommendation.patternId).toBe('PAT-002');
    expect(secondRecommendation.successRate).toBe(88);
    expect(secondRecommendation.proposalApproach).toBe('オンプレミス導入');

    const logContent = mockLogger.logs.join('\n');
    expect(logContent).toMatch(/AIRecommendationEngine呼び出し失敗/);
    expect(logContent).toMatch(/指数バックオフで再試行/);
    expect(logContent).toMatch(/最大3回の再試行完了後/);
    expect(logContent).toMatch(/内部パターンマスタより代替結果を返却/);

    expect(mockEngineStub.callCount).toBe(3);
  });
});