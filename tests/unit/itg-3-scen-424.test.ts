import { extractImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  test('SCEN-424: 不整合ログが1件の場合、該当項目が正しく抽出される', () => {
    // 不整合ログデータの準備
    const inconsistency_log_id = 'log_001';
    const inconsistency_content =
      '商談フェーズ: 提案段階と記録されているが、顧客からの反応がなく30日間音信不通';
    const inconsistency_severity = 'high';

    // AIRecommendationEngineのスタブ設定
    const ai_recommendation_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_001',
        improvement_item: 'フォローメール（商談後のパーソナライズされた追跡メール）の定期送付ルール化',
        reasoning:
          '30日間の音信不通を解消するため、顧客の課題に応じたパーソナライズされたフォローメールを定期的に送付する運用ルールが必要',
        importance_score: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テストデータの準備
    const test_data = {
      inconsistency_logs: [
        {
          log_id: inconsistency_log_id,
          content: inconsistency_content,
          severity: inconsistency_severity,
          detected_at: '2024-01-15T10:30:00Z',
        },
      ],
    };

    // 改善対象項目抽出機能を実行
    const result = extractImprovementItems(test_data, ai_recommendation_engine_stub);

    // AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されたことを確認
    expect(ai_recommendation_engine_stub.generateRecommendation).toHaveBeenCalled();

    // 抽出結果の検証
    expect(result).toBeDefined();
    expect(result.extracted_items).toHaveLength(1);

    const extracted_item = result.extracted_items[0];
    expect(extracted_item.inconsistency_log_id).toBe(inconsistency_log_id);
    expect(extracted_item.improvement_item).toBe(
      'フォローメール（商談後のパーソナライズされた追跡メール）の定期送付ルール化'
    );
    expect(extracted_item.reasoning).toBe(
      '30日間の音信不通を解消するため、顧客の課題に応じたパーソナライズされたフォローメールを定期的に送付する運用ルールが必要'
    );
    expect(extracted_item.importance_score).toBe(85);
  });
});