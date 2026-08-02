import { defineCollectionPeriod } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1059
  test('営業部長による開催決定時に、収集対象期間が明確に設定される', () => {
    const user_id = 'user_001';
    const user_role = 'SALES_MANAGER';
    const collection_definition_id = 'def_001';
    const start_date = '2024-04-01';
    const end_date = '2024-06-30';
    const decision_status = 'DECIDED';

    const result = defineCollectionPeriod({
      user_id,
      user_role,
      collection_definition_id,
      start_date,
      end_date,
    });

    expect(result.collection_definition_id).toBe('def_001');
    expect(result.status).toBe('DECIDED');
    expect(result.start_date).toBe('2024-04-01');
    expect(result.end_date).toBe('2024-06-30');
    expect(result.period_confirmed).toBe(true);
    expect(result.target_period).toBe('2024-04-01～2024-06-30');
  });
});