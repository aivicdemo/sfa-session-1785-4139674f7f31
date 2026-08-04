import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2686
  test('推奨内容の生成根拠が空文字列のとき、根拠表示として「詳細情報なし」が出力される', () => {
    const mockRecommendationData = {
      recommendationId: 'rec-001',
      dealId: 'deal-12345',
      proposedApproach: '新規顧客への初回提案',
      reasoning: '',
      confidenceScore: 85,
      relatedSuccessPatterns: [
        {
          patternId: 'pattern-001',
          description: '初回提案パターン',
          matchScore: 0.92,
        },
      ],
      recommendedTiming: new Date('2024-01-20T10:00:00Z'),
      createdAt: new Date('2024-01-15T08:30:00Z'),
    };

    const result = displayRecommendationReasoning(mockRecommendationData);

    expect(result).toEqual({
      reasoningDisplay: '詳細情報なし',
      hasDetailedInfo: false,
      confidenceScoreLabel: '85%',
      successPatternCount: 1,
    });

    expect(result.reasoningDisplay).toBe('詳細情報なし');
    expect(result.hasDetailedInfo).toBe(false);
    expect(result.confidenceScoreLabel).toBe('85%');
    expect(result.successPatternCount).toBe(1);
  });
});