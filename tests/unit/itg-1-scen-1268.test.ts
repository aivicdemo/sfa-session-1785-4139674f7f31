import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/logic/it-1';

// Mock types for Tx3Imp1AiClient
interface HealthCheckResult {
  status: string;
  timestamp: string;
}

interface DataQualityResult {
  score: number;
  issues: Array<{ severity: string; description: string }>;
}

interface InferenceAccuracyResult {
  accuracy_score: number;
  timestamp: string;
}

interface AggregatedAnomalies {
  anomalies: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
}

interface RootCauseAnalysisRequest {
  health_check: HealthCheckResult;
  data_quality: DataQualityResult;
  inference_accuracy: InferenceAccuracyResult;
  aggregated_anomalies: AggregatedAnomalies;
}

interface Tx3Imp1AiClient {
  performHealthCheck(): Promise<HealthCheckResult>;
  analyzeDataQuality(): Promise<DataQualityResult>;
  evaluateInferenceAccuracy(): Promise<InferenceAccuracyResult>;
  aggregateAnomalies(
    hc: HealthCheckResult,
    dq: DataQualityResult,
    ia: InferenceAccuracyResult
  ): Promise<AggregatedAnomalies>;
  analyzeRootCause(req: RootCauseAnalysisRequest): Promise<string>;
}

interface HandoverPayload {
  health_check_result: HealthCheckResult;
  data_quality_result: DataQualityResult;
  inference_accuracy_result: InferenceAccuracyResult;
  aggregated_anomalies: AggregatedAnomalies;
  additional_investigation_items: string[];
}

interface HandoverNotification {
  message: string;
  investigation_items: string[];
}

interface AuditEvent {
  type: string;
  timestamp: string;
  escalation_reason: string;
  handover_target_info: string;
}

interface AgentExecutionResult {
  status: string;
  report_creation_state: string;
  handover_payload: HandoverPayload | null;
  handover_notification: HandoverNotification | null;
  side_effects_skipped: boolean;
  audit_events: AuditEvent[];
}

describe('営業プロセス実行状況の監査ダッシュボード - Tx3Imp1エスカレーション', () => {
  // SCEN-1268
  test('ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 AIエージェント - 根本原因特定に追加調査が必要な場合に副作用確定前に人へ引き継ぐ', async () => {
    // Arrange: fake Tx3Imp1AiClient の準備
    const fakeAiClient: Tx3Imp1AiClient = {
      performHealthCheck: jest.fn().mockResolvedValue({
        status: 'healthy',
        timestamp: '2024-01-15T10:00:00Z',
      } as HealthCheckResult),

      analyzeDataQuality: jest.fn().mockResolvedValue({
        score: 92,
        issues: [
          {
            severity: 'low',
            description: '欠損値が0.5%検出',
          },
        ],
      } as DataQualityResult),

      evaluateInferenceAccuracy: jest.fn().mockResolvedValue({
        accuracy_score: 94,
        timestamp: '2024-01-15T10:00:00Z',
      } as InferenceAccuracyResult),

      aggregateAnomalies: jest
        .fn()
        .mockResolvedValue(
          {
            anomalies: [
              {
                type: 'data_quality_minor_issue',
                severity: 'low',
                description: 'データ品質スコアが僅かに低下',
              },
            ],
          } as AggregatedAnomalies
        ),

      analyzeRootCause: jest.fn().mockResolvedValue(
        '複数の要因が複合的に作用している可能性があり、根本原因の特定に追加調査が必要です。' +
          'さらに詳しい分析には以下の情報が必要です：' +
          '1. 過去1ヶ月のデータ入力パターンの詳細分析 ' +
          '2. システムログにおけるバッチ処理の実行履歴確認 ' +
          '3. 営業担当者の入力ガイドラインの改訂状況確認'
      ),
    };

    // Act: エージェント実行
    const result: AgentExecutionResult = await runTx3Imp1Agent(fakeAiClient);

    // Assert: 期待結果の検証
    // 1. 異常報告書の作成状態が『人員待機中』に設定される
    expect(result.report_creation_state).toBe('人員待機中');

    // 2. 引き継ぎ対象情報が構造化されたペイロードで保持される
    expect(result.handover_payload).not.toBeNull();
    expect(result.handover_payload?.health_check_result.status).toBe('healthy');
    expect(result.handover_payload?.health_check_result.timestamp).toBe(
      '2024-01-15T10:00:00Z'
    );
    expect(result.handover_payload?.data_quality_result.score).toBe(92);
    expect(
      result.handover_payload?.data_quality_result.issues[0].severity
    ).toBe('low');
    expect(result.handover_payload?.inference_accuracy_result.accuracy_score).toBe(
      94
    );
    expect(result.handover_payload?.aggregated_anomalies.anomalies).toHaveLength(
      1
    );
    expect(
      result.handover_payload?.aggregated_anomalies.anomalies[0].type
    ).toBe('data_quality_minor_issue');

    // 3. 追加調査項目が引き継ぎ情報に含まれる
    expect(result.handover_payload?.additional_investigation_items).toEqual([
      '過去1ヶ月のデータ入力パターンの詳細分析',
      'システムログにおけるバッチ処理の実行履歴確認',
      '営業担当者の入力ガイドラインの改訂状況確認',
    ]);

    // 4. 人員への通知メッセージに根本原因特定に必要な追加調査項目が明記される
    expect(result.handover_notification).not.toBeNull();
    expect(result.handover_notification?.message).toContain(
      '根本原因の特定に追加調査が必要'
    );
    expect(result.handover_notification?.investigation_items).toEqual([
      '過去1ヶ月のデータ入力パターンの詳細分析',
      'システムログにおけるバッチ処理の実行履歴確認',
      '営業担当者の入力ガイドラインの改訂状況確認',
    ]);

    // 5. 副作用確定ステップ（対応優先度の最終決定、運用ルール改善の実施指示など）がスキップされる
    expect(result.side_effects_skipped).toBe(true);

    // 6. オーケストレータの実行ステータスが『escalated_pending_human_review』で記録される
    expect(result.status).toBe('escalated_pending_human_review');

    // 7. 監査イベントとして『root_cause_analysis_escalated』タイプのログが記録される
    const auditEvent = result.audit_events.find(
      (evt) => evt.type === 'root_cause_analysis_escalated'
    );
    expect(auditEvent).toBeDefined();
    expect(auditEvent?.timestamp).toBe('2024-01-15T10:00:00Z');
    expect(auditEvent?.escalation_reason).toContain(
      '根本原因の特定に追加調査が必要'
    );
    expect(auditEvent?.handover_target_info).toBeDefined();

    // 8. AIクライアントの各メソッドが正しい順序で呼び出されたことを確認
    expect(fakeAiClient.performHealthCheck).toHaveBeenCalled();
    expect(fakeAiClient.analyzeDataQuality).toHaveBeenCalled();
    expect(fakeAiClient.evaluateInferenceAccuracy).toHaveBeenCalled();
    expect(fakeAiClient.aggregateAnomalies).toHaveBeenCalled();
    expect(fakeAiClient.analyzeRootCause).toHaveBeenCalled();
  });
});