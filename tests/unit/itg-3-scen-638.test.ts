import { evaluatePatternRelevanceWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 外部AI推奨エンジン失敗時の代替評価', () => {
  test('SCEN-638: evaluatePatternRelevanceが失敗したとき、スコアなしで代替評価を実施する', async () => {
    // スタブ: AIRecommendationEngineのevaluatePatternRelevanceを失敗状態に設定
    const failingRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(new Error('evaluatePatternRelevance timeout')),
    };

    // 推奨パターンマスタから統計的に上位の成功パターンを返すスタブ
    const patternMaster = [
      {
        pattern_id: 'PAT-001',
        customer_industry: '製造業',
        customer_size: 'large',
        success_count: 85,
        total_count: 100,
        success_rate: 0.85,
        pattern_name: '大規模製造業向け効率化提案',
        description: '生産ラインの自動化による効率化を軸とした提案',
      },
      {
        pattern_id: 'PAT-002',
        customer_industry: '製造業',
        customer_size: 'large',
        success_count: 72,
        total_count: 95,
        success_rate: 0.758,
        pattern_name: '大規模製造業向けコスト削減提案',
        description: '供給チェーン最適化によるコスト削減提案',
      },
      {
        pattern_id: 'PAT-003',
        customer_industry: '金融',
        customer_size: 'medium',
        success_count: 60,
        total_count: 80,
        success_rate: 0.75,
        pattern_name: '中堅金融向けデジタル化提案',
        description: 'DX推進による業務効率化提案',
      },
    ];

    // 新規案件データ
    const newDealInput = {
      customer_industry: '製造業',
      customer_size: 'large',
      deal_stage: 'initial_inquiry',
      estimated_amount: 5000000,
    };

    // 指数バックオフ再試行のログを記録するためのスパイ
    let retryCount = 0;
    const originalEvaluate = failingRecommendationEngine.evaluatePatternRelevance;
    failingRecommendationEngine.evaluatePatternRelevance = jest.fn(async () => {
      retryCount++;
      if (retryCount > 3) {
        throw new Error('Max retries exceeded');
      }
      throw new Error('evaluatePatternRelevance timeout');
    });

    // 提案アプローチ推奨機能を実行
    const result = await evaluatePatternRelevanceWithFallback(
      newDealInput,
      failingRecommendationEngine,
      patternMaster
    );

    // 期待結果: スコア値が0またはnullで設定される
    expect(result.relevance_score).toBe(0);

    // 推奨パターンマスタから統計的に上位の成功パターンが返却される
    expect(result.recommended_pattern).toBeDefined();
    expect(result.recommended_pattern.pattern_id).toBe('PAT-001');
    expect(result.recommended_pattern.pattern_name).toBe('大規模製造業向け効率化提案');
    expect(result.recommended_pattern.success_rate).toBe(0.85);

    // 根拠説明は簡略版が表示される
    expect(result.explanation_type).toBe('simplified');
    expect(typeof result.simplified_explanation).toBe('string');
    expect(result.simplified_explanation.length).toBeGreaterThan(0);

    // 利用者向けメッセージが表示される
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 最大3回の再試行が実行されたことを確認
    expect(retryCount).toBeLessThanOrEqual(3);

    // システムが代替動作に移行したことを示すフラグ
    expect(result.fallback_applied).toBe(true);

    // 推奨結果全体が正しい構造を持つ
    expect(result).toEqual({
      relevance_score: 0,
      recommended_pattern: {
        pattern_id: 'PAT-001',
        customer_industry: '製造業',
        customer_size: 'large',
        success_count: 85,
        total_count: 100,
        success_rate: 0.85,
        pattern_name: '大規模製造業向け効率化提案',
        description: '生産ラインの自動化による効率化を軸とした提案',
      },
      explanation_type: 'simplified',
      simplified_explanation: expect.any(String),
      user_message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallback_applied: true,
      retry_count: expect.any(Number),
    });
  });
});