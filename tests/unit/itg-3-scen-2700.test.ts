import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジックの外部サービス呼び出し - タイムアウトと再試行', () => {
  // SCEN-2700
  test('API呼び出しがタイムアウト（30秒超）したとき、1秒待機後に指数バックオフで最大3回再試行され、最終失敗時は代替表示メッセージと統計的上位パターンが返却される', async () => {
    const customerId = 'CUST-2024-001';
    const dealCondition = {
      industry: '製造業',
      companySize: '中堅企業',
      budgetRange: '5000万円以上1億円未満',
      decisionMakingCycle: '3ヶ月',
      currentChallenge: '生産効率化',
    };

    const mockCallTimestamps: number[] = [];
    const mockCallCount = { count: 0 };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => {
        mockCallTimestamps.push(Date.now());
        mockCallCount.count += 1;
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API timeout exceeded 30 seconds'));
          }, 35000);
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const topPatternFromMaster = {
      patternId: 'PAT-2024-0001',
      approachName: '段階的導入アプローチ',
      successRate: 0.78,
      applicableIndustries: ['製造業', '流通業'],
      description: '初期段階で小規模パイロット実施後、本格導入',
      recommendationScore: 85,
    };

    const expectedResult = {
      success: false,
      fallbackMode: true,
      recommendedPattern: topPatternFromMaster,
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      retryAttempts: 3,
      retryBackoffSequence: [1000, 2000, 4000],
    };

    const result = await generateRecommendation(
      customerId,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(result.success).toBe(false);
    expect(result.fallbackMode).toBe(true);
    expect(result.recommendedPattern.patternId).toBe('PAT-2024-0001');
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.retryAttempts).toBe(3);
    expect(mockCallCount.count).toBe(3);

    if (mockCallTimestamps.length >= 2) {
      const firstRetryDelay = mockCallTimestamps[1] - mockCallTimestamps[0];
      expect(firstRetryDelay).toBeGreaterThanOrEqual(1000 - 100);
      expect(firstRetryDelay).toBeLessThan(1000 + 500);
    }

    if (mockCallTimestamps.length >= 3) {
      const secondRetryDelay = mockCallTimestamps[2] - mockCallTimestamps[1];
      expect(secondRetryDelay).toBeGreaterThanOrEqual(2000 - 100);
      expect(secondRetryDelay).toBeLessThan(2000 + 500);
    }

    expect(result.retryBackoffSequence).toEqual([1000, 2000, 4000]);
  });
});