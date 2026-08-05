import { validateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-969
  test('成功要因・失敗要因の抽出と承認基準検証 - ワークショップ参加者が複数の場合でも承認基準判定が正常に実行される', () => {
    const workshop_id = 'ws_001';
    const participant_a_id = 'participant_a';
    const participant_b_id = 'participant_b';
    const participant_c_id = 'participant_c';

    const participants = [
      {
        participant_id: participant_a_id,
        participant_name: '参加者A',
        workshop_id: workshop_id,
        registered_at: '2024-01-15T09:00:00Z',
      },
      {
        participant_id: participant_b_id,
        participant_name: '参加者B',
        workshop_id: workshop_id,
        registered_at: '2024-01-15T09:05:00Z',
      },
      {
        participant_id: participant_c_id,
        participant_name: '参加者C',
        workshop_id: workshop_id,
        registered_at: '2024-01-15T09:10:00Z',
      },
    ];

    const success_factors_a = [
      {
        factor_id: 'sf_a_001',
        participant_id: participant_a_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '顧客ニーズの早期段階での引き出し',
        input_timestamp: '2024-01-15T10:00:00Z',
      },
      {
        factor_id: 'sf_a_002',
        participant_id: participant_a_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '提案資料の事前カスタマイズ',
        input_timestamp: '2024-01-15T10:05:00Z',
      },
      {
        factor_id: 'sf_a_003',
        participant_id: participant_a_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '成約後の定期フォローアップ実施',
        input_timestamp: '2024-01-15T10:10:00Z',
      },
    ];

    const failure_factors_a = [
      {
        factor_id: 'ff_a_001',
        participant_id: participant_a_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: '初回接触時の提案資料不備',
        input_timestamp: '2024-01-15T10:15:00Z',
      },
      {
        factor_id: 'ff_a_002',
        participant_id: participant_a_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: 'フォローアップ間隔が長すぎた',
        input_timestamp: '2024-01-15T10:20:00Z',
      },
    ];

    const success_factors_b = [
      {
        factor_id: 'sf_b_001',
        participant_id: participant_b_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '顧客ニーズの早期段階での引き出し',
        input_timestamp: '2024-01-15T10:30:00Z',
      },
      {
        factor_id: 'sf_b_002',
        participant_id: participant_b_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '提案資料の事前カスタマイズ',
        input_timestamp: '2024-01-15T10:35:00Z',
      },
      {
        factor_id: 'sf_b_003',
        participant_id: participant_b_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '成約後の定期フォローアップ実施',
        input_timestamp: '2024-01-15T10:40:00Z',
      },
    ];

    const failure_factors_b = [
      {
        factor_id: 'ff_b_001',
        participant_id: participant_b_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: '初回接触時の提案資料不備',
        input_timestamp: '2024-01-15T10:45:00Z',
      },
      {
        factor_id: 'ff_b_002',
        participant_id: participant_b_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: 'フォローアップ間隔が長すぎた',
        input_timestamp: '2024-01-15T10:50:00Z',
      },
    ];

    const success_factors_c = [
      {
        factor_id: 'sf_c_001',
        participant_id: participant_c_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '顧客ニーズの早期段階での引き出し',
        input_timestamp: '2024-01-15T11:00:00Z',
      },
      {
        factor_id: 'sf_c_002',
        participant_id: participant_c_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '提案資料の事前カスタマイズ',
        input_timestamp: '2024-01-15T11:05:00Z',
      },
      {
        factor_id: 'sf_c_003',
        participant_id: participant_c_id,
        workshop_id: workshop_id,
        factor_type: 'success',
        factor_description: '成約後の定期フォローアップ実施',
        input_timestamp: '2024-01-15T11:10:00Z',
      },
    ];

    const failure_factors_c = [
      {
        factor_id: 'ff_c_001',
        participant_id: participant_c_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: '初回接触時の提案資料不備',
        input_timestamp: '2024-01-15T11:15:00Z',
      },
      {
        factor_id: 'ff_c_002',
        participant_id: participant_c_id,
        workshop_id: workshop_id,
        factor_type: 'failure',
        factor_description: 'フォローアップ間隔が長すぎた',
        input_timestamp: '2024-01-15T11:20:00Z',
      },
    ];

    const all_factors = [
      ...success_factors_a,
      ...failure_factors_a,
      ...success_factors_b,
      ...failure_factors_b,
      ...success_factors_c,
      ...failure_factors_c,
    ];

    const validation_input = {
      workshop_id: workshop_id,
      participants: participants,
      factors: all_factors,
    };

    const result = validateApprovalCriteria(validation_input);

    expect(result.approval_status).toBe('approved');
    expect(result.participants_processed_count).toBe(3);
    expect(result.success_factors_aggregated_count).toBe(9);
    expect(result.failure_factors_aggregated_count).toBe(6);
    expect(result.consistency_check_passed).toBe(true);
    expect(result.completeness_check_passed).toBe(true);
    expect(result.validation_details).toEqual(
      expect.objectContaining({
        participant_a: expect.objectContaining({
          success_factor_count: 3,
          failure_factor_count: 2,
          completeness_status: 'complete',
          consistency_status: 'consistent',
        }),
        participant_b: expect.objectContaining({
          success_factor_count: 3,
          failure_factor_count: 2,
          completeness_status: 'complete',
          consistency_status: 'consistent',
        }),
        participant_c: expect.objectContaining({
          success_factor_count: 3,
          failure_factor_count: 2,
          completeness_status: 'complete',
          consistency_status: 'consistent',
        }),
      })
    );
  });
});