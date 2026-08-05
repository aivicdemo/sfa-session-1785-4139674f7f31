import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1229
  it('データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 抽出対象データが定義された範囲外である場合に副作用の確定前に人へ引き継ぐ', async () => {
    const out_of_range_start_date = '2025-13-01';
    const out_of_range_end_date = '2025-14-31';
    const extraction_request_id = 'extract_req_invalid_range_001';
    const user_id = 'mgr_001';

    const extraction_request = {
      request_id: extraction_request_id,
      start_date: out_of_range_start_date,
      end_date: out_of_range_end_date,
      target_user_id: user_id,
      sales_rep_ids: ['rep_001', 'rep_002'],
    };

    const ai_response = {
      action: 'validate_extraction_range',
      status: 'escalation_required',
      escalation_condition: '抽出対象データが定義された範囲外である',
      invalid_range_details: {
        requested_start: out_of_range_start_date,
        requested_end: out_of_range_end_date,
        error_reason: 'Month values exceed valid range (13, 14 detected)',
      },
      recommended_action: '抽出対象期間を再度指定してください',
    };

    fetchMock.mockResponseOnce(JSON.stringify(ai_response), { status: 200 });

    const result = await runTx1Imp1Agent(extraction_request);

    expect(result.agent_state).toBe('escalated_awaiting_human_review');
    expect(result.escalation_condition).toBe('抽出対象データが定義された範囲外である');
    expect(result.has_side_effects_executed).toBe(false);

    const processing_log = result.processing_logs[0];
    expect(processing_log).toBeDefined();
    expect(processing_log.timestamp).toBeDefined();
    expect(processing_log.escalation_reason).toBe('抽出対象データが定義された範囲外である');
    expect(processing_log.request_id).toBe(extraction_request_id);

    const human_review_notification = result.human_review_notification;
    expect(human_review_notification).toBeDefined();
    expect(human_review_notification.extraction_range.start_date).toBe(out_of_range_start_date);
    expect(human_review_notification.extraction_range.end_date).toBe(out_of_range_end_date);
    expect(human_review_notification.anomaly_details).toContain('定義された範囲外');
    expect(human_review_notification.recommended_action).toBe('抽出対象期間を再度指定してください');

    expect(result.side_effect_status.extraction_executed).toBe(false);
    expect(result.side_effect_status.quality_validation_executed).toBe(false);
    expect(result.side_effect_status.data_cleaning_executed).toBe(false);
    expect(result.side_effect_status.analysis_system_registration_executed).toBe(false);

    expect(result.rollback_transactions).toEqual([]);

    expect(result.audit_event).toBeDefined();
    expect(result.audit_event.event_type).toBe('escalation');
    expect(result.audit_event.escalation_reason).toBe('抽出対象データが定義された範囲外である');
  });
});