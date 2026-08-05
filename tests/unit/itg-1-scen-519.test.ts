import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-519
  test('[edge] 業務上の最大規模である10000件を超えるAIエージェント推論ログが正しく監視される', () => {
    // 10001件のスタブデータ生成
    const inferenceLogStubs = Array.from({ length: 10001 }, (_, index) => ({
      inference_id: `infer_${String(index + 1).padStart(5, '0')}`,
      timestamp: new Date(`2024-01-15T${String(Math.floor(index / 60)).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}:00Z`).toISOString(),
      accuracy_score: 85 + Math.random() * 15,
      agent_id: `agent_${(index % 10) + 1}`,
    }));

    // 監視対象システムの設定で監視ログ件数の上限を10000件に設定
    const monitoring_config = {
      log_limit: 10000,
      timeout_seconds: 30,
      alert_threshold_warning: 10000,
    };

    // 生成した10001件のログをシステムに一括送信して監視処理実行
    const start_time = Date.now();
    const result = monitorAiInferenceAccuracy({
      inference_logs: inferenceLogStubs,
      config: monitoring_config,
    });
    const processing_time_ms = Date.now() - start_time;

    // (1) 処理済みログ件数が10001件と記録される
    expect(result.processed_log_count).toBe(10001);

    // (2) 監視ログ上限超過を検知し、『処理ログ件数がしきい値10000件を超過しました。超過件数：1件』というアラートイベントが生成される
    expect(result.alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alert_type: 'LOG_LIMIT_EXCEEDED',
          message: '処理ログ件数がしきい値10000件を超過しました。超過件数：1件',
          excess_count: 1,
        }),
      ])
    );

    // (3) アラート重要度は『警告』に分類される
    const threshold_alert = result.alerts.find(
      (alert: { alert_type: string }) => alert.alert_type === 'LOG_LIMIT_EXCEEDED'
    );
    expect(threshold_alert).toBeDefined();
    expect(threshold_alert.severity).toBe('WARNING');

    // (4) システムの処理時間が120秒以内である
    expect(processing_time_ms).toBeLessThanOrEqual(120000);
  });
});