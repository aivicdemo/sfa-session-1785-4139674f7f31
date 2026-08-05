import { describe, test, expect, beforeEach } from '@jest/globals';
import { addCustomerReactionToLearningData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント学習データ蓄積機能 - 最大レコード件数直下での追加', () => {
  // SCEN-448
  test('顧客反応データが学習データ蓄積の最大レコード件数直下で追加される', () => {
    const MAX_LEARNING_DATA_RECORDS = 10000;
    const EXISTING_RECORD_COUNT = 9999;
    
    const existing_records: Array<{
      id: string;
      timestamp: string;
      customer_id: string;
      reaction_value: number;
    }> = Array.from({ length: EXISTING_RECORD_COUNT }, (_, i) => ({
      id: `record_${i + 1}`,
      timestamp: new Date(2024, 0, 1 + Math.floor(i / 100)).toISOString(),
      customer_id: `customer_${(i % 50) + 1}`,
      reaction_value: (i % 5) + 1,
    }));

    const new_customer_reaction = {
      id: 'record_10000',
      timestamp: '2024-02-15T14:30:00Z',
      customer_id: 'customer_101',
      reaction_value: 4,
    };

    const result = addCustomerReactionToLearningData(
      existing_records,
      new_customer_reaction,
      MAX_LEARNING_DATA_RECORDS
    );

    expect(result.total_records).toBe(MAX_LEARNING_DATA_RECORDS);
    expect(result.records.length).toBe(MAX_LEARNING_DATA_RECORDS);

    const last_record = result.records[result.records.length - 1];
    expect(last_record.id).toBe('record_10000');
    expect(last_record.timestamp).toBe('2024-02-15T14:30:00Z');
    expect(last_record.customer_id).toBe('customer_101');
    expect(last_record.reaction_value).toBe(4);

    expect(result.records[0].id).toBe('record_1');
    expect(result.records[EXISTING_RECORD_COUNT - 1].id).toBe(`record_${EXISTING_RECORD_COUNT}`);
  });
});