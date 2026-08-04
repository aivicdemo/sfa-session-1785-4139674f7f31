import { validateTrainingDataVolume } from '../../src/logic/it-1-br-3-3-2-1';

describe('学習データ量検証機能', () => {
  test('SCEN-126: 学習データが最小要件ちょうどの件数で検証が許可される', () => {
    const MIN_TRAINING_DATA_COUNT = 100;
    const training_data_count = 100;

    const result = validateTrainingDataVolume({
      training_data_count: training_data_count,
      min_required_count: MIN_TRAINING_DATA_COUNT,
    });

    expect(result.status_code).toBe(200);
    expect(result.is_valid).toBe(true);
    expect(result.training_data_count).toBe(100);
    expect(result.validation_message).toMatch(/要件充足/);
    expect(result.validation_message).toMatch(/最小要件100件以上/);
  });
});