import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateProcessDeviationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-387
  test('提案内容が標準プロセスと完全に一致している場合、乖離度が0.0として数値化される', () => {
    const standardProcessSteps = [
      {
        step_id: 'step_001',
        step_name: '初期接触',
        sequence_order: 1,
        expected_duration_days: 1
      },
      {
        step_id: 'step_002',
        step_name: 'ニーズ把握',
        sequence_order: 2,
        expected_duration_days: 3
      },
      {
        step_id: 'step_003',
        step_name: '提案資料作成',
        sequence_order: 3,
        expected_duration_days: 5
      },
      {
        step_id: 'step_004',
        step_name: 'プレゼンテーション',
        sequence_order: 4,
        expected_duration_days: 2
      },
      {
        step_id: 'step_005',
        step_name: '契約締結',
        sequence_order: 5,
        expected_duration_days: 1
      }
    ];

    const actualProposalSteps = [
      {
        step_id: 'step_001',
        step_name: '初期接触',
        sequence_order: 1,
        actual_duration_days: 1,
        executed_date: '2024-01-15T09:00:00Z'
      },
      {
        step_id: 'step_002',
        step_name: 'ニーズ把握',
        sequence_order: 2,
        actual_duration_days: 3,
        executed_date: '2024-01-18T10:00:00Z'
      },
      {
        step_id: 'step_003',
        step_name: '提案資料作成',
        sequence_order: 3,
        actual_duration_days: 5,
        executed_date: '2024-01-23T14:00:00Z'
      },
      {
        step_id: 'step_004',
        step_name: 'プレゼンテーション',
        sequence_order: 4,
        actual_duration_days: 2,
        executed_date: '2024-01-25T11:00:00Z'
      },
      {
        step_id: 'step_005',
        step_name: '契約締結',
        sequence_order: 5,
        actual_duration_days: 1,
        executed_date: '2024-01-26T16:00:00Z'
      }
    ];

    const deviation_score = calculateProcessDeviationScore(
      standardProcessSteps,
      actualProposalSteps
    );

    expect(deviation_score).toBe(0.0);
  });
});