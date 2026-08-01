import { calculateAIInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-497: AIエージェント推論精度スコア算出機能 - 対象の顧客対応パターンが1件の場合、精度スコアが正常に算出される', async () => {
    // 顧客対応パターンデータの準備
    const customerInteractionPattern = {
      pattern_id: 'pat_001',
      interaction_date: '2024-01-15T10:30:00Z',
      interaction_content: '顧客からの問い合わせに対し、標準提案アプローチに従って対応',
      interaction_personnel: 'sales_001',
      customer_satisfaction_score: 85,
      interaction_type: 'phone_contact',
      resolution_status: 'resolved',
    };

    // AIエージェント推論精度スコア算出機能の実行
    const accuracyScore = await calculateAIInferenceAccuracyScore({
      customer_interaction_patterns: [customerInteractionPattern],
      inference_timestamp: '2024-01-15T11:00:00Z',
    });

    // 期待結果の検証
    // スコアが0～100の範囲内であること
    expect(accuracyScore).toBeGreaterThanOrEqual(0);
    expect(accuracyScore).toBeLessThanOrEqual(100);

    // スコアが小数第2位までの精度で表現されていること
    const scoreDecimalPlaces = (accuracyScore.toString().split('.')[1] || '').length;
    expect(scoreDecimalPlaces).toBeLessThanOrEqual(2);

    // 1件の顧客対応パターンに基づく推論精度を正確に反映
    // 顧客満足度スコア85と対応内容の標準プロセス準拠度から
    // 期待される精度スコアは85.00
    expect(accuracyScore).toBe(85.00);
  });
});