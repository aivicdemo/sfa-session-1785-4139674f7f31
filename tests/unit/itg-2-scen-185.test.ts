import { decidePriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-185
  test('検証結果にエラー種別が記載されていないとき、優先度決定がスキップされる', () => {
    const validation_result_without_error_type = {
      validation_id: 'VAL-001',
      customer_id: 'CUST-12345',
      validation_timestamp: new Date('2024-01-15T11:00:00Z'),
      error_type: undefined,
      error_count: 5,
      severity_score: 0.7,
    };

    const priority_decision_result = decidePriority(validation_result_without_error_type);

    expect(priority_decision_result).toEqual({
      skip_flag: true,
      priority_score: null,
      priority_level: undefined,
    });
  });
});