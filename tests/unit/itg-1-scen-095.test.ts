import { validateLearningData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-095
  test('AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データ検証に成功し、同じ入力で2回実行しても同じ結果が返される', async () => {
    const sample_dataset = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      value: Math.random() * 100,
      timestamp: '2024-01-15T10:00:00Z',
    }));

    const first_result = await validateLearningData(sample_dataset);

    const first_validation_status = first_result.validationStatus;
    const first_data_count = first_result.dataCount;
    const first_quality_score = first_result.qualityScore;
    const first_timestamp = first_result.timestamp;

    const second_result = await validateLearningData(sample_dataset);

    const second_validation_status = second_result.validationStatus;
    const second_data_count = second_result.dataCount;
    const second_quality_score = second_result.qualityScore;
    const second_timestamp = second_result.timestamp;

    expect(first_validation_status).toBe('合格');
    expect(first_data_count).toBe(100);
    expect(first_quality_score).toBe(95.0);

    expect(second_validation_status).toBe('合格');
    expect(second_data_count).toBe(100);
    expect(second_quality_score).toBe(95.0);

    expect(first_validation_status).toBe(second_validation_status);
    expect(first_data_count).toBe(second_data_count);
    expect(first_quality_score).toBe(second_quality_score);
  });
});