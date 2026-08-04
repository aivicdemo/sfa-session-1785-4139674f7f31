import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-682
  test('OpenAI API呼び出しが失敗した場合、簡略版の根拠説明を返す', async () => {
    const recommendationId = 'REC-12345';
    const dealConditions = {
      industry: '製造業',
      dealValue: 5000000,
      customerSize: 'large'
    };

    let apiCallCount = 0;
    const mockAIEngine = {
      explainRecommendationReasoning: async () => {
        apiCallCount++;
        if (apiCallCount <= 3) {
          const error = new Error('Service Unavailable');
          (error as any).status = 503;
          throw error;
        }
        return {
          status: 'success',
          reasoning: 'AI generated reasoning'
        };
      }
    };

    const mockPatternMaster = {
      findTopPattern: () => ({
        patternId: 'PAT-001',
        successRate: 85,
        applicableIndustry: '製造業',
        recommendedApproach: 'コスト削減提案'
      })
    };

    const result = await explainRecommendationReasoning(
      {
        recommendationId,
        dealConditions
      },
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.status).toBe('fallback');
    expect(result.reasoning).toBe('過去の成功パターンから推奨します。本アプローチは同業界で成功率85%の実績があります。');
    expect(result.patternId).toBe('PAT-001');
    expect(result.isSimplified).toBe(true);
    expect(result.source).toBe('pattern_master');
    expect(apiCallCount).toBe(3);
  });
});