import { validateLearningDataAndQuality } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ・品質自動検証機能', () => {
  // SCEN-122
  test('学習データが最小要件を満たし品質が良好な状態で、推論実行指示が0件のときも検証ロジックが正常に動作する', () => {
    const training_data_records = Array.from({ length: 120 }, (_, i) => ({
      record_id: `rec_${i + 1}`,
      sales_person_id: `sp_${(i % 5) + 1}`,
      customer_id: `cust_${(i % 10) + 1}`,
      proposal_amount: 50000 + i * 1000,
      contact_date: new Date('2024-01-01').toISOString(),
      deal_stage: ['initial', 'proposal', 'negotiation', 'closed'][i % 4],
      outcome: ['success', 'failure'][i % 2],
      required_field_1: `value_${i}`,
      required_field_2: i > 114 ? null : `data_${i}`,
    }));

    const quality_score = 85;
    const inference_directive_count = 0;
    const timestamp_str = '2024-01-15T10:30:00Z';

    const result = validateLearningDataAndQuality({
      training_records: training_data_records,
      data_quality_score: quality_score,
      inference_directive_count: inference_directive_count,
      validation_timestamp: timestamp_str,
    });

    expect(result.validation_status).toBe('PASS');
    expect(result.training_record_count).toBe(120);
    expect(result.quality_score).toBe(85);
    expect(result.inference_directive_count).toBe(0);
    expect(result.error_message).toBeNull();
    expect(result.completion_timestamp).toBe(timestamp_str);
    expect(result.meets_minimum_records).toBe(true);
    expect(result.quality_sufficient).toBe(true);
  });
});