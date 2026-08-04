import { classifyErrorsByCategory } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - エラーカテゴリ別分類機能', () => {
  // SCEN-448
  test('不整合ログが1種類のエラーカテゴリのみの場合、該当カテゴリに分類される', () => {
    // 不整合ログデータを準備：データ型不一致のみに該当する特性を持つ
    const incontinuityLog = {
      log_id: 'log-001',
      field_name: 'customer_age',
      expected_type: 'number',
      actual_value: '25years',
      detected_at: new Date('2024-01-15T11:00:00Z'),
      description: 'Expected numeric value but received string with suffix'
    };

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        category: 'データ型不一致',
        confidence_score: 0.85
      })
    };

    // 準備した不整合ログをエラーカテゴリ別分類機能に入力
    const classificationResult = classifyErrorsByCategory(
      incontinuityLog,
      aiEngineStub
    );

    // 分類結果のエラーカテゴリリストを確認
    expect(classificationResult.categories).toEqual(['データ型不一致']);
    expect(classificationResult.categories).toHaveLength(1);
    expect(classificationResult.categories).not.toContain('ロジックエラー');
    expect(classificationResult.categories).not.toContain('権限不足');

    // 該当ログに対する確信度スコアが0.8以上であることを検証
    expect(classificationResult.confidence_score).toBeGreaterThanOrEqual(0.8);
    expect(classificationResult.confidence_score).toBe(0.85);
  });
});