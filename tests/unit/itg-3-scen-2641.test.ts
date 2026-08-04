import { generateRecommendationWithRetry } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨生成機能 - API呼び出しタイムアウト時の指数バックオフ再試行', () => {
  // SCEN-2641
  test('APIがタイムアウトしたとき、最大3回の指数バックオフ再試行が実行され、代替動作で推奨パターンマスタから上位成功パターンが返却される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('Request timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationPatternMaster = [
      {
        id: 'pattern_001',
        name: '大規模企業向けクラウド導入提案',
        successRate: 0.92,
        applicableIndustries: ['IT', '金融', '製造'],
        description: '大規模企業のレガシーシステム近代化を支援するクラウド導入パッケージ',
        ranking: 1,
      },
      {
        id: 'pattern_002',
        name: '中堅企業向けコスト最適化提案',
        successRate: 0.87,
        applicableIndustries: ['小売', 'サービス'],
        description: '既存インフラのコスト最適化による利益率向上提案',
        ranking: 2,
      },
    ];

    const inputCustomerData = {
      customerId: 'cust_20240115_001',
      customerName: 'テスト顧客株式会社',
      industry: 'IT',
      scale: 'large',
      budget: 5000000,
      timeline: 90,
    };

    const inputDealCondition = {
      dealId: 'deal_20240115_001',
      dealStage: 'initial_contact',
      currentChallenge: 'システム老朽化',
      decisionMakers: 3,
      competitionExists: true,
    };

    const timings: number[] = [];
    const originalNow = Date.now;
    let callIndex = 0;

    Date.now = jest.fn(() => {
      if (callIndex === 0) {
        timings.push(0);
        callIndex++;
        return 0;
      } else if (callIndex === 1) {
        timings.push(1000);
        callIndex++;
        return 1000;
      } else if (callIndex === 2) {
        timings.push(3000);
        callIndex++;
        return 3000;
      } else if (callIndex === 3) {
        timings.push(7000);
        callIndex++;
        return 7000;
      }
      return originalNow();
    });

    let result;
    try {
      result = await generateRecommendationWithRetry(
        inputCustomerData,
        inputDealCondition,
        mockAIRecommendationEngine,
        mockRecommendationPatternMaster,
      );
    } finally {
      Date.now = originalNow;
    }

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(4);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenNthCalledWith(
      1,
      inputCustomerData,
      inputDealCondition,
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenNthCalledWith(
      2,
      inputCustomerData,
      inputDealCondition,
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenNthCalledWith(
      3,
      inputCustomerData,
      inputDealCondition,
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenNthCalledWith(
      4,
      inputCustomerData,
      inputDealCondition,
    );

    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendationPattern: {
        id: 'pattern_001',
        name: '大規模企業向けクラウド導入提案',
        successRate: 0.92,
        applicableIndustries: ['IT', '金融', '製造'],
        description: '大規模企業のレガシーシステム近代化を支援するクラウド導入パッケージ',
        ranking: 1,
      },
      retryAttempts: 3,
      totalApiCalls: 4,
    });
  });
});