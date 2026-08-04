import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動抽出・提案アプローチ推奨機能', () => {
  // SCEN-611
  test('OpenAI APIが失敗した場合に内部の推奨パターンマスタから統計上位の成功パターンが返却される', async () => {
    // OpenAI API呼び出しが失敗するようにモック化
    const failed_ai_engine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタテストデータ
    const pattern_master = [
      {
        pattern_id: 'PAT_A',
        success_rate: 87,
        applied_count: 142,
        pattern_name: 'パターンA',
      },
      {
        pattern_id: 'PAT_B',
        success_rate: 72,
        applied_count: 98,
        pattern_name: 'パターンB',
      },
      {
        pattern_id: 'PAT_C',
        success_rate: 65,
        applied_count: 55,
        pattern_name: 'パターンC',
      },
    ];

    // 新規案件データ
    const new_deal = {
      industry: '製造業',
      budget_range: 50000000,
      decision_makers_count: 3,
    };

    // テスト対象の推奨機能を呼び出し
    const result = await generateRecommendation(new_deal, failed_ai_engine, pattern_master);

    // (1) パターンA（成功率87%、最高順位）が推奨内容として返却される
    expect(result.recommended_pattern.pattern_id).toBe('PAT_A');
    expect(result.recommended_pattern.pattern_name).toBe('パターンA');

    // (2) 推奨根拠は「内部統計パターン」として簡略版で表示される
    expect(result.recommendation_reason).toBe('内部統計パターン');

    // (3) UI上には「推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します」というユーザー向けメッセージが表示される
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // (4) 返却データに過去成功パターンの統計情報（成功率87%、実績件数142件）が含まれる
    expect(result.recommended_pattern.success_rate).toBe(87);
    expect(result.recommended_pattern.applied_count).toBe(142);

    // OpenAI API呼び出しが最大3回の指数バックオフ再試行を実行したことをモック呼び出し履歴で確認
    expect(failed_ai_engine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});