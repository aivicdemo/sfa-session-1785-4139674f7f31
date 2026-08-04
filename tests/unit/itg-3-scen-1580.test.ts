import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1580
  test('推奨根拠表示機能 - AIエージェント呼び出し失敗時に代替処理が実行される', async () => {
    const recommendationId = 'rec-12345';
    const customerId = 'cust-67890';
    const dealConditions = {
      industry: 'manufacturing',
      companySize: 'mid-size',
      budget: 500000,
      timeline: 'Q2-2024'
    };

    let callCount = 0;
    const maxRetries = 3;
    const retryDelays = [1000, 2000, 4000];

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(async () => {
        callCount++;
        if (callCount <= maxRetries) {
          const delay = retryDelays[callCount - 1];
          await new Promise(resolve => setTimeout(resolve, delay));
          throw new Error('Request timeout: API call exceeded 30 seconds');
        }
        return null;
      })
    };

    const cachedPastRecommendations = [
      {
        id: 'cached-1',
        customerId: 'cust-similar-1',
        pattern: 'この業界での成功率が高いパターンです',
        adoptionRate: 0.78,
        timestamp: '2024-01-10T14:30:00Z'
      },
      {
        id: 'cached-2',
        customerId: 'cust-similar-2',
        pattern: '同規模企業での導入事例が豊富です',
        adoptionRate: 0.72,
        timestamp: '2024-01-08T09:15:00Z'
      }
    ];

    const mockRecommendationPatternMaster = {
      getTopPatterns: jest.fn(() => [
        {
          patternId: 'pat-001',
          description: 'この業界での成功率が高いパターンです',
          successRate: 0.85,
          applicableIndustries: ['manufacturing', 'construction']
        }
      ])
    };

    const result = await explainRecommendationReasoning(
      {
        recommendationId,
        customerId,
        dealConditions
      },
      {
        aiEngine: mockAIEngine,
        patternMaster: mockRecommendationPatternMaster,
        cachedRecommendations: cachedPastRecommendations,
        maxRetries,
        retryDelays
      }
    );

    expect(callCount).toBe(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);

    expect(result.status).toBe('fallback');
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.cachedRecommendation).toEqual({
      id: 'cached-1',
      customerId: 'cust-similar-1',
      pattern: 'この業界での成功率が高いパターンです',
      adoptionRate: 0.78,
      timestamp: '2024-01-10T14:30:00Z'
    });

    expect(result.simplifiedExplanation).toBe(
      'この業界での成功率が高いパターンです'
    );

    expect(result.errorLog).toMatch(
      /AIRecommendationEngine\.explainRecommendationReasoning 呼び出し失敗、最大再試行回数に達したため代替動作を実行/
    );

    expect(result.fallbackExplanationSource).toBe('patternMaster');
    expect(result.recommendationPatternApplied).toEqual({
      patternId: 'pat-001',
      description: 'この業界での成功率が高いパターンです',
      successRate: 0.85,
      applicableIndustries: ['manufacturing', 'construction']
    });
  });
});