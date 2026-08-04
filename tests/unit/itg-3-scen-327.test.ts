import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-327
  test('推奨精度が設定閾値未満の場合、改善提案が生成される', () => {
    const threshold = 0.70;
    const actualScore = 0.65;

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: actualScore,
        reasoning: '類似した過去事例が少ないため信頼度が低い'
      })
    };

    const dealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      decisionMakers: 3
    };

    const result = evaluateRecommendationRelevance(
      dealCondition,
      threshold,
      mockAIEngine
    );

    expect(result).toEqual({
      precision_score: 0.65,
      meets_threshold: false,
      improvement_suggestion: {
        reason: '類似した過去事例が少ないため信頼度が低い',
        actions: [
          'ヒアリング情報を追加入力してください',
          '決定権者の詳細情報を確認してください'
        ],
        expected_precision_after_improvement: 0.80
      },
      display_format: {
        highlight_style: 'red_border',
        position: 'below_recommendation'
      }
    });

    expect(result.precision_score).toBe(0.65);
    expect(result.meets_threshold).toBe(false);
    expect(result.improvement_suggestion.reason).toMatch(/類似した過去事例/);
    expect(result.improvement_suggestion.actions).toContain('ヒアリング情報を追加入力してください');
    expect(result.improvement_suggestion.expected_precision_after_improvement).toBe(0.80);
    expect(result.display_format.highlight_style).toBe('red_border');
  });
});