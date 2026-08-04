import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨根拠の説明文生成（OpenAI API失敗時の代替表示）', () => {
  // SCEN-2040
  test('OpenAI API呼び出しが最大3回の再試行後も失敗した場合、簡略版説明が代替表示される', async () => {
    const customerInfo = {
      customerName: 'テスト商社A',
      industry: '製造業',
      challengeContent: '在庫管理コスト削減'
    };

    const dealCondition = {
      proposalAmount: 5000000,
      proposalPeriod: 12,
      competitiveStatus: '競合3社'
    };

    let apiCallCount = 0;
    const retryDelaysMs = [1000, 2000, 4000];

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(async () => {
        apiCallCount++;
        const expectedDelay = retryDelaysMs[apiCallCount - 1];
        
        if (apiCallCount <= 3) {
          const error = new Error('API timeout: exceeded 30000ms');
          (error as any).isTimeout = true;
          throw error;
        }
        return { explanation: 'This should not be reached' };
      })
    };

    const result = await explainRecommendationReasoning(
      customerInfo,
      dealCondition,
      mockAIEngine
    );

    expect(apiCallCount).toBe(3);
    expect(result.explanation).toBe('過去の成功事例から推奨しています');
    expect(result.hasDetailedAnalysis).toBe(false);
    expect(result.isSimplified).toBe(true);
    expect(result.sourcePattern).toEqual({
      customerSegment: '製造業',
      dealSize: '5000万円帯',
      successRate: 0.78
    });
  });
});