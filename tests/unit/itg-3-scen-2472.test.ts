import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2472
  test('[normal] 推奨内容の根拠表示機能 - OpenAI APIが失敗時、キャッシュされた過去推奨から類似案件が表示される', async () => {
    // テスト用スタブ: AIRecommendationEngine の失敗を模擬
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout')),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'pattern_001',
          industry: '製造業',
          deal_amount_min: 5000000,
          deal_amount_max: 10000000,
          proposal_approach: 'コスト削減重視',
          success_count: 12,
          success_rate: 0.85
        },
        {
          pattern_id: 'pattern_002',
          industry: '製造業',
          deal_amount_min: 5000000,
          deal_amount_max: 10000000,
          proposal_approach: '業務効率化',
          success_count: 10,
          success_rate: 0.82
        },
        {
          pattern_id: 'pattern_003',
          industry: '製造業',
          deal_amount_min: 5000000,
          deal_amount_max: 10000000,
          proposal_approach: '品質向上',
          success_count: 8,
          success_rate: 0.80
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の成功事例に基づいています'
      )
    };

    // 推奨パターンマスタのキャッシュ（過去成功事例3件以上）
    const recommendationPatternCache = [
      {
        pattern_id: 'pattern_001',
        industry: '製造業',
        company_size: '中堅',
        challenge: '業務効率化',
        deal_amount: 7000000,
        proposal_approach: 'コスト削減重視',
        success_count: 12,
        success_rate: 0.85
      },
      {
        pattern_id: 'pattern_002',
        industry: '製造業',
        company_size: '中堅',
        challenge: '業務効率化',
        deal_amount: 7500000,
        proposal_approach: '業務効率化',
        success_count: 10,
        success_rate: 0.82
      },
      {
        pattern_id: 'pattern_003',
        industry: '製造業',
        company_size: '中堅',
        challenge: 'コスト最適化',
        deal_amount: 6500000,
        proposal_approach: '品質向上',
        success_count: 8,
        success_rate: 0.80
      }
    ];

    // 新規案件の入力条件
    const new_deal_input = {
      customer_industry: '製造業',
      customer_company_size: '中堅',
      customer_challenge: '業務効率化',
      estimated_deal_amount: 7000000
    };

    // テスト対象関数の呼び出し（AIRecommendationEngineのスタブを引数で渡す）
    const result = await explainRecommendationReasoning(
      new_deal_input,
      mockAIRecommendationEngine,
      recommendationPatternCache,
      {
        maxRetries: 3,
        initialBackoffMs: 1000,
        timeoutMs: 30000
      }
    );

    // 検証1: 最大3回の再試行が実行されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 検証2: API失敗後にフォールバック処理が実行されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();

    // 検証3: ユーザー向けメッセージが正しく表示されることを確認
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 検証4: 推奨パターンマスタから統計的に上位の類似成功パターンが返されることを確認
    expect(result.recommendation_patterns).toBeDefined();
    expect(result.recommendation_patterns.length).toBeGreaterThanOrEqual(1);

    // 検証5: 返された推奨パターンが入力条件に基づいて適切にフィルタリングされていることを確認
    // 業種「製造業」、企業規模「中堅」、商談額「700万円」に近いパターンが上位に来ること
    const top_pattern = result.recommendation_patterns[0];
    expect(top_pattern.industry).toBe('製造業');
    expect(top_pattern.company_size).toBe('中堅');
    expect(top_pattern.deal_amount).toBeLessThanOrEqual(10000000);
    expect(top_pattern.deal_amount).toBeGreaterThanOrEqual(5000000);

    // 検証6: 根拠説明が簡略版であることを確認
    expect(result.reasoning_brief).toBe('過去の成功事例に基づいています');

    // 検証7: 簡略版根拠には詳細なステップが含まれていないことを確認
    expect(result.reasoning_brief.length).toBeLessThan(100);

    // 検証8: フォールバック処理の状態が正しく記録されていることを確認
    expect(result.fallback_applied).toBe(true);
    expect(result.recommendation_source).toBe('cached_pattern_master');
  });
});