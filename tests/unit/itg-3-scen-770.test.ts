import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-770
  test('AIRecommendationEngine.generateRecommendation がタイムアウト時、内部推奨パターンマスタから統計的上位パターンが返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(() =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API timeout exceeded 30s'));
          }, 31000);
        })
      ),
    };

    const mockInternalPatterns = [
      {
        patternId: 'PAT-001',
        patternName: '大規模顧客向け提案パターン',
        successRate: 0.85,
        applicableConditions: {
          minCompanySize: 1000,
          industries: ['製造', '金融'],
        },
        proposalApproach: 'エグゼクティブブリーフィング＋カスタマイズ提案',
      },
      {
        patternId: 'PAT-002',
        patternName: '中堅企業向け迅速導入パターン',
        successRate: 0.78,
        applicableConditions: {
          minCompanySize: 100,
          maxCompanySize: 999,
          industries: ['流通', '製造'],
        },
        proposalApproach: 'ショートデモ＋クイックスタート',
      },
      {
        patternId: 'PAT-003',
        patternName: 'スタートアップ向けグロース支援パターン',
        successRate: 0.72,
        applicableConditions: {
          maxCompanySize: 99,
          industries: ['IT', 'SaaS'],
        },
        proposalApproach: 'スケーラビリティ強調＋成長シナリオ提示',
      },
      {
        patternId: 'PAT-004',
        patternName: '公共機関向け厳密審査対応パターン',
        successRate: 0.68,
        applicableConditions: {
          industries: ['公共', '教育'],
        },
        proposalApproach: 'コンプライアンス＋監査ログ明示',
      },
    ];

    const newProjectInput = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テック・イノベーション',
      industry: '製造',
      companySize: 1500,
      dealStage: 'initial_contact',
      budget: 5000000,
      timeline: 'Q1-2024',
      painPoints: ['プロセス効率化', 'デジタル化', 'コスト削減'],
      previousInteractions: 0,
    };

    const result = await generateRecommendation(
      newProjectInput,
      mockAIEngine,
      mockInternalPatterns
    );

    expect(result).toBeDefined();
    expect(result.fallbackApplied).toBe(true);
    expect(result.recommendedPatterns).toBeDefined();
    expect(result.recommendedPatterns.length).toBeGreaterThanOrEqual(3);

    const topThreePatterns = result.recommendedPatterns.slice(0, 3);

    expect(topThreePatterns[0].successRate).toBeGreaterThanOrEqual(
      topThreePatterns[1].successRate
    );
    expect(topThreePatterns[1].successRate).toBeGreaterThanOrEqual(
      topThreePatterns[2].successRate
    );

    topThreePatterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('patternName');
      expect(pattern).toHaveProperty('successRate');
      expect(pattern.successRate).toBeGreaterThan(0);
      expect(pattern.successRate).toBeLessThanOrEqual(1);
      expect(pattern).toHaveProperty('applicableConditions');
      expect(pattern).toHaveProperty('proposalApproach');
      expect(typeof pattern.proposalApproach).toBe('string');
      expect(pattern.proposalApproach.length).toBeGreaterThan(0);
    });

    expect(result.executionLogs).toBeDefined();
    expect(Array.isArray(result.executionLogs)).toBe(true);
    expect(result.executionLogs.length).toBeGreaterThan(0);

    const timeoutLog = result.executionLogs.find(
      (log) => log.event === 'external_ai_timeout'
    );
    expect(timeoutLog).toBeDefined();
    expect(timeoutLog.timestamp).toBeDefined();

    const fallbackLog = result.executionLogs.find(
      (log) => log.event === 'fallback_pattern_retrieval'
    );
    expect(fallbackLog).toBeDefined();
    expect(fallbackLog.patternsRetrieved).toBeGreaterThanOrEqual(3);

    expect(result.recommendedPatterns[0].patternId).toBe('PAT-001');
    expect(result.recommendedPatterns[0].successRate).toBe(0.85);
    expect(result.recommendedPatterns[1].patternId).toBe('PAT-002');
    expect(result.recommendedPatterns[1].successRate).toBe(0.78);
    expect(result.recommendedPatterns[2].patternId).toBe('PAT-003');
    expect(result.recommendedPatterns[2].successRate).toBe(0.72);
  });
});