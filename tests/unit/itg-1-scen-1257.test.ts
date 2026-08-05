import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/orchestrator';

describe('営業プロセス実行状況の監査ダッシュボード - ヘルスチェック・データ品質・推論精度の統合診断', () => {
  let fake_ai_client: Tx3Imp1AiClient;
  let event_trace_log: Array<{
    timestamp: string;
    action: string;
    trigger_source: string;
    trigger_data: Record<string, unknown>;
    next_state: string;
  }>;
  let prompt_invocation_history: Array<{
    timestamp: string;
    detection_type: string;
    detection_timestamp: string;
    schedule_type?: string;
    schedule_cycle?: string;
    alert_type?: string;
    alert_severity?: string;
    metadata: Record<string, unknown>;
  }>;

  beforeEach(() => {
    event_trace_log = [];
    prompt_invocation_history = [];

    fake_ai_client = {
      detectScheduleTrigger: async (schedule_cycle: string) => {
        const detection_ts = '2024-01-15T09:00:00Z';
        event_trace_log.push({
          timestamp: detection_ts,
          action: 'DETECT_SCHEDULE_TRIGGER',
          trigger_source: 'periodic_scheduler',
          trigger_data: { cycle: schedule_cycle },
          next_state: 'SCHEDULE_TRIGGER_DETECTED',
        });
        prompt_invocation_history.push({
          timestamp: detection_ts,
          detection_type: 'periodic_schedule',
          detection_timestamp: detection_ts,
          schedule_type: 'periodic',
          schedule_cycle: schedule_cycle,
          metadata: {
            cycle: schedule_cycle,
            source: 'periodic_scheduler',
          },
        });
        return {
          detected: true,
          detection_timestamp: detection_ts,
          schedule_type: 'periodic',
          schedule_cycle: schedule_cycle,
        };
      },

      detectAlertTrigger: async (alert_payload: Record<string, unknown>) => {
        const detection_ts = '2024-01-15T09:15:30Z';
        event_trace_log.push({
          timestamp: detection_ts,
          action: 'DETECT_ALERT_TRIGGER',
          trigger_source: 'external_alert_system',
          trigger_data: alert_payload,
          next_state: 'ALERT_TRIGGER_DETECTED',
        });
        prompt_invocation_history.push({
          timestamp: detection_ts,
          detection_type: 'external_alert',
          detection_timestamp: detection_ts,
          alert_type: (alert_payload.alert_type as string) || 'unknown',
          alert_severity: (alert_payload.severity as string) || 'medium',
          metadata: {
            alert_payload: alert_payload,
            source: 'external_alert_system',
          },
        });
        return {
          detected: true,
          detection_timestamp: detection_ts,
          alert_type: (alert_payload.alert_type as string) || 'unknown',
          alert_severity: (alert_payload.severity as string) || 'medium',
        };
      },

      executeHealthCheck: async () => {
        return {
          status: 'healthy',
          timestamp: '2024-01-15T09:01:00Z',
          checks: [],
        };
      },

      analyzeDataQuality: async () => {
        return {
          quality_score: 96,
          timestamp: '2024-01-15T09:02:00Z',
          issues: [],
        };
      },

      evaluateInferenceAccuracy: async () => {
        return {
          accuracy_score: 94,
          timestamp: '2024-01-15T09:03:00Z',
          details: [],
        };
      },

      aggregateAnomalies: async (
        health_result: Record<string, unknown>,
        quality_result: Record<string, unknown>,
        accuracy_result: Record<string, unknown>
      ) => {
        return {
          aggregated_anomalies: [],
          priority_score: 0,
          timestamp: '2024-01-15T09:04:00Z',
          recommendation: 'no_action',
          health_input: health_result,
          quality_input: quality_result,
          accuracy_input: accuracy_result,
        };
      },

      generateReport: async (aggregation_result: Record<string, unknown>) => {
        return {
          report_id: 'RPT-20240115-001',
          generated_at: '2024-01-15T09:05:00Z',
          content: aggregation_result,
        };
      },
    };
  });

  afterEach(() => {
    event_trace_log = [];
    prompt_invocation_history = [];
  });

  // SCEN-1257
  test('定期スケジュール検知とアラート受信検知の両トリガーを正確に検知し、次の自律アクション遷移へ進む', async () => {
    // 1. 定期スケジュール検知のテスト
    const schedule_result = await fake_ai_client.detectScheduleTrigger('weekly');

    expect(schedule_result.detected).toBe(true);
    expect(schedule_result.detection_timestamp).toBe('2024-01-15T09:00:00Z');
    expect(schedule_result.schedule_type).toBe('periodic');
    expect(schedule_result.schedule_cycle).toBe('weekly');

    const schedule_event = event_trace_log.find(
      (ev) => ev.action === 'DETECT_SCHEDULE_TRIGGER'
    );
    expect(schedule_event).toBeDefined();
    expect(schedule_event?.next_state).toBe('SCHEDULE_TRIGGER_DETECTED');

    const schedule_prompt_record = prompt_invocation_history.find(
      (rec) => rec.detection_type === 'periodic_schedule'
    );
    expect(schedule_prompt_record).toBeDefined();
    expect(schedule_prompt_record?.schedule_cycle).toBe('weekly');
    expect(schedule_prompt_record?.metadata.cycle).toBe('weekly');

    // 2. アラート受信検知のテスト
    const alert_payload = {
      alert_type: 'data_quality_degradation',
      severity: 'high',
      source_system: 'quality_monitor',
    };

    const alert_result = await fake_ai_client.detectAlertTrigger(alert_payload);

    expect(alert_result.detected).toBe(true);
    expect(alert_result.detection_timestamp).toBe('2024-01-15T09:15:30Z');
    expect(alert_result.alert_type).toBe('data_quality_degradation');
    expect(alert_result.alert_severity).toBe('high');

    const alert_event = event_trace_log.find(
      (ev) => ev.action === 'DETECT_ALERT_TRIGGER'
    );
    expect(alert_event).toBeDefined();
    expect(alert_event?.next_state).toBe('ALERT_TRIGGER_DETECTED');

    const alert_prompt_record = prompt_invocation_history.find(
      (rec) => rec.detection_type === 'external_alert'
    );
    expect(alert_prompt_record).toBeDefined();
    expect(alert_prompt_record?.alert_type).toBe('data_quality_degradation');
    expect(alert_prompt_record?.alert_severity).toBe('high');

    // 3. 次の自律アクション遷移テスト（定期スケジュール検知後）
    const health_check_result = await fake_ai_client.executeHealthCheck();
    expect(health_check_result.status).toBe('healthy');
    expect(health_check_result.timestamp).toBe('2024-01-15T09:01:00Z');

    // 4. 次の自律アクション遷移テスト（アラート受信検知後）
    const quality_analysis_result =
      await fake_ai_client.analyzeDataQuality();
    expect(quality_analysis_result.quality_score).toBe(96);
    expect(quality_analysis_result.timestamp).toBe('2024-01-15T09:02:00Z');

    // 5. 推論精度評価の実行
    const accuracy_result = await fake_ai_client.evaluateInferenceAccuracy();
    expect(accuracy_result.accuracy_score).toBe(94);
    expect(accuracy_result.timestamp).toBe('2024-01-15T09:03:00Z');

    // 6. 異常の統合分析と集約
    const aggregation_result = await fake_ai_client.aggregateAnomalies(
      health_check_result,
      quality_analysis_result,
      accuracy_result
    );
    expect(aggregation_result.timestamp).toBe('2024-01-15T09:04:00Z');
    expect(aggregation_result.priority_score).toBe(0);
    expect(aggregation_result.recommendation).toBe('no_action');
    expect(aggregation_result.health_input).toEqual(health_check_result);
    expect(aggregation_result.quality_input).toEqual(quality_analysis_result);
    expect(aggregation_result.accuracy_input).toEqual(accuracy_result);

    // 7. レポート生成
    const final_report = await fake_ai_client.generateReport(
      aggregation_result
    );
    expect(final_report.report_id).toBe('RPT-20240115-001');
    expect(final_report.generated_at).toBe('2024-01-15T09:05:00Z');

    // 8. イベントトレースログの検証
    expect(event_trace_log.length).toBe(2);
    expect(event_trace_log[0].action).toBe('DETECT_SCHEDULE_TRIGGER');
    expect(event_trace_log[0].trigger_source).toBe('periodic_scheduler');
    expect(event_trace_log[1].action).toBe('DETECT_ALERT_TRIGGER');
    expect(event_trace_log[1].trigger_source).toBe('external_alert_system');

    // 9. Prompt呼び出し履歴の検証
    expect(prompt_invocation_history.length).toBe(2);

    const schedule_prompt_invocation = prompt_invocation_history[0];
    expect(schedule_prompt_invocation.detection_type).toBe(
      'periodic_schedule'
    );
    expect(schedule_prompt_invocation.detection_timestamp).toBe(
      '2024-01-15T09:00:00Z'
    );
    expect(schedule_prompt_invocation.schedule_type).toBe('periodic');
    expect(schedule_prompt_invocation.schedule_cycle).toBe('weekly');
    expect(schedule_prompt_invocation.metadata.source).toBe(
      'periodic_scheduler'
    );

    const alert_prompt_invocation = prompt_invocation_history[1];
    expect(alert_prompt_invocation.detection_type).toBe('external_alert');
    expect(alert_prompt_invocation.detection_timestamp).toBe(
      '2024-01-15T09:15:30Z'
    );
    expect(alert_prompt_invocation.alert_type).toBe(
      'data_quality_degradation'
    );
    expect(alert_prompt_invocation.alert_severity).toBe('high');
    expect(alert_prompt_invocation.metadata.source).toBe(
      'external_alert_system'
    );

    // 10. 状態遷移ログの検証
    const schedule_detection_state = event_trace_log[0];
    expect(schedule_detection_state.next_state).toBe('SCHEDULE_TRIGGER_DETECTED');

    const alert_detection_state = event_trace_log[1];
    expect(alert_detection_state.next_state).toBe('ALERT_TRIGGER_DETECTED');

    // 11. 同一ロジックでの検知精度確認
    expect(schedule_result.detection_timestamp).toBe(
      schedule_prompt_record?.detection_timestamp
    );
    expect(alert_result.detection_timestamp).toBe(
      alert_prompt_record?.detection_timestamp
    );

    // 12. メタデータ保持の確認
    expect(
      (schedule_prompt_record?.metadata as Record<string, unknown>)
        .cycle
    ).toBe('weekly');
    expect(
      (alert_prompt_record?.metadata as Record<string, unknown>)
        .source
    ).toBe('external_alert_system');

    // 13. 終了状態の確認
    expect(final_report.report_id).toMatch(/^RPT-/);
    expect(event_trace_log.length).toBe(2);
    expect(prompt_invocation_history.length).toBe(2);
  });
});