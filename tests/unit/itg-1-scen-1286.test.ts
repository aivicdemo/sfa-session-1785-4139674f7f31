import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx10Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1286
  test('AIエージェントが高リスク判定時に副作用実行前に人へ引き継ぐ', async () => {
    // Arrange: テスト用の営業データ入力を準備
    const sales_data_input = {
      input_id: 'input_20240115_001',
      timestamp: '2024-01-15T11:00:00Z',
      sales_rep_id: 'rep_002',
      customer_id: 'cust_0042',
      proposal_content: {
        product_id: 'prod_alpha',
        price_amount: 500000,
        term_months: 12,
        discount_percent: 15,
      },
      customer_contact_history: [
        { contact_date: '2024-01-10', method: 'email', response: 'opened' },
        { contact_date: '2024-01-12', method: 'phone', response: 'declined' },
        { contact_date: '2024-01-15', method: 'meeting', response: 'pending' },
      ],
      required_fields_complete: true,
      customer_data_conflict: false,
    };

    // Arrange: AIクライアントのスタブを注入し、高リスク評価を返すように設定
    const mock_ai_client = {
      analyze_proposal_quality: async (proposal_data: any) => ({
        quality_score: 7.2,
        issues: [
          { type: 'discount_excessive', severity: 'medium' },
        ],
      }),
      detect_risky_patterns: async (contact_data: any) => ({
        risk_factors: [
          { factor: 'repeated_rejection', weight: 0.5 },
          { factor: 'pressure_timing', weight: 0.4 },
        ],
        combined_risk_score: 8.5,
        escalation_required: true,
      }),
    };

    // Act: runTx10Imp1Agent を呼び出す
    const result = await runTx10Imp1Agent(
      sales_data_input,
      mock_ai_client
    );

    // Assert 1: AIエージェントが自律処理を順次実行したことを確認
    expect(result).toBeDefined();
    expect(result.processing_steps).toBeDefined();
    expect(result.processing_steps).toContain('DATA_QUALITY_VALIDATION');
    expect(result.processing_steps).toContain('PROPOSAL_CONTENT_ANALYSIS');
    expect(result.processing_steps).toContain('INAPPROPRIATE_PATTERN_DETECTION');
    expect(result.processing_steps).toContain('RISK_ASSESSMENT_CALCULATION');

    // Assert 2: リスク評価スコアが高リスク判定（8.0以上）に該当することを確認
    expect(result.risk_assessment_score).toBe(8.5);
    expect(result.risk_assessment_score).toBeGreaterThanOrEqual(8.0);

    // Assert 3: エスカレーション条件に該当し、処理が停止されたことを確認
    expect(result.escalation_condition_met).toBe(true);
    expect(result.escalation_type).toBe('HIGH_RISK_DETECTED');

    // Assert 4: 副作用が実行される前に処理が停止されたことを確認
    expect(result.status).toBe('PENDING_HUMAN_REVIEW');
    expect(result.side_effects_executed).toBe(false);
    expect(result.notification_sent).toBe(false);
    expect(result.customer_data_persisted).toBe(false);
    expect(result.automatic_message_sent).toBe(false);

    // Assert 5: システムが人への引き継ぎワークフローに遷移したことを確認
    expect(result.workflow_state).toBe('ESCALATION_INITIATED');
    expect(result.escalation_reason).toBe('HIGH_RISK_DETECTED');
    expect(result.pending_human_review).toBe(true);

    // Assert 6: 管理者レビュー用の詳細情報が記録されていることを確認
    expect(result.review_details).toBeDefined();
    expect(result.review_details.input_data_id).toBe('input_20240115_001');
    expect(result.review_details.detected_patterns).toBeDefined();
    expect(result.review_details.detected_patterns).toContain('repeated_rejection');
    expect(result.review_details.detected_patterns).toContain('pressure_timing');
    expect(result.review_details.risk_score).toBe(8.5);
    expect(result.review_details.risk_factors).toEqual([
      { factor: 'repeated_rejection', weight: 0.5 },
      { factor: 'pressure_timing', weight: 0.4 },
    ]);
    expect(result.review_details.recommended_action).toBeDefined();
    expect(result.review_details.review_status).toBe('AWAITING_REVIEW');

    // Assert 7: 副作用がレビュー待機状態で記録されていることを確認
    expect(result.pending_side_effects).toBeDefined();
    expect(result.pending_side_effects.alert_notification).toEqual({
      status: 'PENDING',
      target: 'admin_review_queue',
      triggered_at: '2024-01-15T11:00:00Z',
    });
    expect(result.pending_side_effects.customer_data_update).toBe('PENDING');
    expect(result.pending_side_effects.sales_rep_auto_message).toBe('PENDING');

    // Assert 8: 監査ログに HIGH_RISK_ESCALATION_INITIATED イベントが記録されていることを確認
    expect(result.audit_log).toBeDefined();
    expect(result.audit_log.length).toBeGreaterThan(0);
    const escalation_event = result.audit_log.find(
      (event: any) => event.event_type === 'HIGH_RISK_ESCALATION_INITIATED'
    );
    expect(escalation_event).toBeDefined();
    expect(escalation_event.timestamp).toBe('2024-01-15T11:00:00Z');
    expect(escalation_event.input_data_id).toBe('input_20240115_001');
    expect(escalation_event.escalation_reason).toBe('HIGH_RISK_DETECTED');
    expect(escalation_event.risk_score).toBe(8.5);
    expect(escalation_event.handover_initiation_time).toBe('2024-01-15T11:00:00Z');
    expect(escalation_event.review_queue_id).toBeDefined();

    // Assert 9: 副作用実行が遅延実行状態であることを確認
    expect(result.side_effects_execution_mode).toBe('DELAYED');
    expect(result.delayed_execution_trigger).toBe('ADMIN_APPROVAL');
    expect(result.can_auto_execute).toBe(false);

    // Assert 10: AIエージェント推論の信頼度が記録されていることを確認
    expect(result.ai_inference_confidence).toBeDefined();
    expect(result.ai_inference_confidence).toBeGreaterThanOrEqual(0.75);
    expect(result.ai_inference_confidence).toBeLessThanOrEqual(1.0);
  });
});