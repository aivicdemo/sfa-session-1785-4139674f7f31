import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx1Imp1Agent } from '../../src/agents/tx-1-imp-1/orchestrator';
import type { Tx1Imp1AiClient } from '../../src/agents/tx-1-imp-1/orchestrator';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1231: [error] データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 重複検出の信頼度が低い場合の判断で副作用確定前に人へ引き継ぐ
  test('重複検出信頼度が閾値以下の場合、人間レビュー待機状態に遷移し副作用は実行されない', async () => {
    const extraction_period_start = '2024-01-01';
    const extraction_period_end = '2024-01-31';
    const duplicate_confidence_threshold = 0.7;
    const detected_confidence_score = 0.45;
    const duplicate_candidate_count = 15;
    const api_status_code = 200;

    const mock_extracted_logs = [
      {
        id: 'log_001',
        date: '2024-01-15',
        sales_rep_id: 'rep_101',
        customer_id: 'cust_201',
        action_type: 'visit',
        notes: 'Initial contact',
      },
      {
        id: 'log_002',
        date: '2024-01-16',
        sales_rep_id: 'rep_101',
        customer_id: 'cust_202',
        action_type: 'phone_call',
        notes: 'Follow-up',
      },
    ];

    const mock_quality_validation_result = {
      total_records: 2,
      complete_records: 2,
      missing_fields: 0,
      format_errors: 0,
      quality_score: 1.0,
    };

    const mock_duplicate_detection_result = {
      confidence_score: detected_confidence_score,
      duplicate_candidates: duplicate_candidate_count,
      confidence_level: 'LOW',
      candidate_pairs: [
        {
          record_id_1: 'cust_201',
          record_id_2: 'cust_201_alt',
          similarity_score: 0.42,
        },
      ],
    };

    const mock_ai_client: Partial<Tx1Imp1AiClient> = {
      extractProcessLogs: jest
        .fn()
        .mockResolvedValue({
          logs: mock_extracted_logs,
          extraction_status: 'success',
          record_count: mock_extracted_logs.length,
        }),

      validateDataCompleteness: jest
        .fn()
        .mockResolvedValue(mock_quality_validation_result),

      detectDuplicates: jest.fn().mockResolvedValue({
        duplicates: mock_duplicate_detection_result,
        escalation_required: true,
        escalation_reason: 'low_confidence_duplicate_detection',
      }),

      cleanAndNormalize: jest
        .fn()
        .mockRejectedValue(
          new Error(
            'Should not be called before human review of duplicate detection'
          )
        ),

      registerToAnalysisSystem: jest
        .fn()
        .mockRejectedValue(
          new Error('Should not be called before human review')
        ),
    };

    const execution_context = {
      extraction_period_start,
      extraction_period_end,
      api_connection_status: 'healthy',
      sales_system_api_available: true,
    };

    const execution_result = await runTx1Imp1Agent(
      execution_context,
      mock_ai_client as Tx1Imp1AiClient
    );

    expect(execution_result.current_state).toBe('PendingHumanReview');
    expect(execution_result.escalation_triggered).toBe(true);
    expect(execution_result.escalation_condition).toBe(
      'low_confidence_duplicate_detection'
    );

    expect(execution_result.execution_log).toContainEqual(
      expect.objectContaining({
        step: 'extract_process_logs',
        status: 'completed',
      })
    );

    expect(execution_result.execution_log).toContainEqual(
      expect.objectContaining({
        step: 'validate_data_completeness',
        status: 'completed',
      })
    );

    expect(execution_result.execution_log).toContainEqual(
      expect.objectContaining({
        step: 'detect_duplicates',
        status: 'completed',
      })
    );

    expect(execution_result.execution_log).not.toContainEqual(
      expect.objectContaining({
        step: 'clean_and_normalize',
        status: 'completed',
      })
    );

    expect(execution_result.execution_log).not.toContainEqual(
      expect.objectContaining({
        step: 'register_to_analysis_system',
        status: 'completed',
      })
    );

    expect(execution_result.escalation_notification).toEqual(
      expect.objectContaining({
        escalation_reason: 'duplicate_detection_confidence_below_threshold',
        detected_confidence_score: detected_confidence_score,
        confidence_threshold: duplicate_confidence_threshold,
        duplicate_candidate_count: duplicate_candidate_count,
        required_human_decision:
          'verify_and_judge_duplicate_merge_appropriateness',
      })
    );

    expect(execution_result.human_review_interface_available).toBe(true);
    expect(execution_result.human_review_interface).toEqual(
      expect.objectContaining({
        action: 'specify_duplicate_candidates_resolution',
        description:
          'Specify duplicate merge judgment or rejection for each candidate pair',
      })
    );

    expect(mock_ai_client.cleanAndNormalize).not.toHaveBeenCalled();
    expect(mock_ai_client.registerToAnalysisSystem).not.toHaveBeenCalled();

    expect(execution_result.side_effects_confirmed).toBe(false);
    expect(execution_result.side_effects_executed).toBe(false);
  });
});