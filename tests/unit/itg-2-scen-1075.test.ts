import { defineDataCollectionPeriod } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1075
  test('収集対象期間が月をまたいで設定される', () => {
    const start_date = new Date('2024-01-15T00:00:00Z');
    const end_date = new Date('2024-02-20T00:00:00Z');

    const result = defineDataCollectionPeriod({
      start_date,
      end_date
    });

    expect(result.start_date).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(result.end_date).toEqual(new Date('2024-02-20T00:00:00Z'));
    expect(result.period_type).toBe('cross_month');
    expect(result.is_valid_period).toBe(true);
    expect(result.total_days).toBe(37);
    expect(result.collection_definition_id).toBeDefined();
    expect(typeof result.collection_definition_id).toBe('string');
  });
});