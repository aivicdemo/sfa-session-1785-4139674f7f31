import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠可視化機能 - OpenAI API失敗時のフォールバック', () => {
  // SCEN-274
  test('OpenAI APIが3回の指数バックオフ再試行後も応答しないとき、内部推奨パターンマスタから統計的上位パターンが返却される', async () => {
    // Arrange: スタブの失敗設定と内部パターンマスタの準備
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout')),
    };

    const mockPatternMaster = [
      {
        id: 'pattern_001',
        industry: 'IT',
        company_size: 'mid',
        challenge_pattern: 'DX推進',
        approach: 'クラウド移行支援パッケージ提案',
        success_count: 45,
        success_rate: 0.92,
        brief_rationale: 'DX推進企業向けの標準提案',
      },
      {
        id: 'pattern_002',
        industry: 'IT',
        company_size: 'mid',
        challenge_pattern: 'DX推進',
        approach: 'セキュリティ強化ソリューション',
        success_count: 38,
        success_rate: 0.88,
        brief_rationale: 'セキュリティリスク軽減',
      },
      {
        id: 'pattern_003',
        industry: 'IT',
        company_size: 'mid',
        challenge_pattern: 'DX推進',
        approach: 'デジタル組織改革コンサルティング',
        success_count: 32,
        success_rate: 0.85,
        brief_rationale: '組織体制の最適化',
      },
      {
        id: 'pattern_004',
        industry: 'Manufacturing',
        company_size: 'large',
        challenge_pattern: '生産効率化',
        approach: 'IoT導入支援',
        success_count: 28,
        success_rate: 0.81,
        brief_rationale: 'IoT導入コンサル',
      },
    ];

    const customerInput = {
      industry: 'IT',
      company_size: 'mid',
      challenge_pattern: 'DX推進',
    };

    // Act: 推奨生成リクエストを実行
    const result = await generateRecommendationWithFallback(
      customerInput,
      mockAIEngine,
      mockPatternMaster
    );

    // Assert: OpenAI API呼び出しが3回失敗したことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 返却された推奨が統計的上位パターンのいずれかであることを確認
    const top_three_patterns = mockPatternMaster
      .sort((a, b) => b.success_count - a.success_count)
      .slice(0, 3);

    const returned_pattern_ids = [
      result.recommendation.pattern_id,
    ];

    const is_from_top_three = top_three_patterns.some(
      (p) => p.id === result.recommendation.pattern_id
    );
    expect(is_from_top_three).toBe(true);

    // 返却結果の内容が正確であることを確認
    const matched_pattern = mockPatternMaster.find(
      (p) => p.id === result.recommendation.pattern_id
    );
    expect(matched_pattern).toBeDefined();
    expect(result.recommendation.approach).toBe(matched_pattern!.approach);
    expect(result.recommendation.success_rate).toBe(matched_pattern!.success_rate);

    // 根拠説明が簡略版（通常版より50%以下）であることを確認
    const brief_rationale_length = result.recommendation.rationale.length;
    const typical_full_rationale_length = 200; // 通常版の推定文字数
    expect(brief_rationale_length).toBeLessThanOrEqual(
      typical_full_rationale_length * 0.5
    );

    // 簡略版根拠がマスタの brief_rationale と一致することを確認
    expect(result.recommendation.rationale).toBe(matched_pattern!.brief_rationale);

    // ユーザー通知メッセージが正しく設定されていることを確認
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // フォールバック使用フラグが true であることを確認
    expect(result.is_fallback).toBe(true);

    // 推奨ソースがキャッシュ（内部パターンマスタ）であることを確認
    expect(result.recommendation_source).toBe('internal_pattern_master');
  });
});