import { evaluateProblemDetectionResults } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-860: 問題検出結果の重要度・根拠・対応必要性判定機能 - 業務上の最大規模検出結果数（10000件）で判定処理が完了する', () => {
    // 10000件の問題検出結果オブジェクトをメモリ上に生成
    const problem_detection_results = Array.from({ length: 10000 }, (_, index) => ({
      problem_id: `PROB_${String(index + 1).padStart(5, '0')}`,
      severity_raw: Math.floor(Math.random() * 100),
      evidence_text: `Problem evidence for item ${index + 1}`,
      affected_entity_count: Math.floor(Math.random() * 100) + 1,
      business_impact_score: Math.random() * 10,
      detected_at: new Date('2024-01-15T10:00:00Z').toISOString(),
    }));

    // 判定処理の開始時刻をタイムスタンプで記録
    const start_time = Date.now();

    // 判定処理を実行
    const result = evaluateProblemDetectionResults({
      detection_results: problem_detection_results,
      evaluation_timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
    });

    // 判定処理の終了時刻をタイムスタンプで記録
    const end_time = Date.now();
    const elapsed_seconds = (end_time - start_time) / 1000;

    // 処理完了の戻り値（成功フラグ）と処理結果の件数をアサーション
    expect(result.success).toBe(true);
    expect(result.evaluated_results).toHaveLength(10000);

    // すべての結果が必須フィールドを持つことを確認
    result.evaluated_results.forEach((item, index) => {
      expect(item.problem_id).toBe(`PROB_${String(index + 1).padStart(5, '0')}`);
      expect(['high', 'medium', 'low']).toContain(item.severity);
      expect(typeof item.evidence).toBe('string');
      expect(item.evidence.length).toBeGreaterThan(0);
      expect(typeof item.requires_action).toBe('boolean');
    });

    // 処理時間が30秒以内で完了することを確認
    expect(elapsed_seconds).toBeLessThan(30);

    // エラーが発生していないことを確認
    expect(result.error_message).toBeUndefined();

    // 処理結果の統計情報を確認
    const high_severity_count = result.evaluated_results.filter(
      (item) => item.severity === 'high'
    ).length;
    const medium_severity_count = result.evaluated_results.filter(
      (item) => item.severity === 'medium'
    ).length;
    const low_severity_count = result.evaluated_results.filter(
      (item) => item.severity === 'low'
    ).length;
    const requires_action_count = result.evaluated_results.filter(
      (item) => item.requires_action === true
    ).length;

    // 重要度分類が正しく実施されていることを確認
    expect(
      high_severity_count + medium_severity_count + low_severity_count
    ).toBe(10000);

    // 対応必要性判定が実施されていることを確認
    expect(requires_action_count).toBeGreaterThanOrEqual(0);
    expect(requires_action_count).toBeLessThanOrEqual(10000);

    // 処理完了メッセージを確認
    expect(result.completion_message).toBeDefined();
    expect(typeof result.completion_message).toBe('string');
  });
});