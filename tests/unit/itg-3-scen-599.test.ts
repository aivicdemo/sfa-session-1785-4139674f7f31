import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-599
  test('[normal] AIエージェント推奨根拠の可視化機能 - OpenAI APIが正常応答した場合に生成された推奨根拠が表示される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning_text: '過去3年間の類似案件（IT業界、予算500万円規模）では、クラウド導入+業務プロセス改善のアプローチで75%の成約率を達成しています。\n\n【適用条件】\n- 業種: IT企業（従業員規模50～500名）\n- 予算規模: 400万円～800万円\n- 課題パターン: 業務効率化・システム統合\n\n【成功要因】\n• ヒアリング段階での詳細な業務フロー把握\n• ROI シミュレーションの提示\n• 導入前のパイロット提案\n\n【リスク要因】\n• 導入期間中の業務停止リスク（対策: 段階導入）\n• 既存システムとの互換性確認が必須',
        confidence_score: 78,
        similar_cases_count: 12,
        success_rate: 0.75,
      }),
    };

    const newDealData = {
      customer_name: 'テスト太郎',
      industry: 'IT',
      budget_amount: 5000000,
      business_challenge: '業務効率化',
      company_size: 'mid_market',
    };

    const result = await explainRecommendationReasoning(
      newDealData,
      mockAIEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        reasoning_text: expect.stringContaining('過去3年間の類似案件'),
        reasoning_formatted: expect.objectContaining({
          summary: expect.stringContaining('クラウド導入'),
          applicable_conditions: expect.arrayContaining([
            expect.objectContaining({
              criterion: 'industry',
              value: 'IT企業（従業員規模50～500名）',
            }),
            expect.objectContaining({
              criterion: 'budget_range',
              value: '400万円～800万円',
            }),
            expect.objectContaining({
              criterion: 'challenge_type',
              value: '業務効率化・システム統合',
            }),
          ]),
          success_factors: expect.arrayContaining([
            'ヒアリング段階での詳細な業務フロー把握',
            'ROI シミュレーションの提示',
            '導入前のパイロット提案',
          ]),
          risk_factors: expect.arrayContaining([
            expect.objectContaining({
              risk: '導入期間中の業務停止リスク',
              mitigation: '段階導入',
            }),
            expect.objectContaining({
              risk: '既存システムとの互換性確認が必須',
              mitigation: expect.any(String),
            }),
          ]),
        }),
        confidence_score: 78,
        similar_cases_count: 12,
        success_rate: 0.75,
        is_visible: true,
      })
    );

    expect(result.reasoning_text.length).toBeGreaterThan(0);
    expect(result.confidence_score).toBe(78);
    expect(result.success_rate).toBe(0.75);
    expect(result.is_visible).toBe(true);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newDealData
    );
  });
});