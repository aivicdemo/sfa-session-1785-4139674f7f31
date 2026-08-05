import { describe, test, expect } from '@jest/globals';
import { accumulateCustomerReactionAsLearningData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント学習データ蓄積機能 - 顧客反応データ追加', () => {
  // SCEN-447
  test('顧客反応データが学習データ蓄積の最大レコード件数ちょうどで追加される', () => {
    const MAX_LEARNING_DATA_RECORDS = 10000;
    const CURRENT_RECORD_COUNT = 9999;
    const NEW_RECORD_ID = 'reaction_12345';
    const NEW_RECORD_CONTENT = {
      customer_id: 'cust_001',
      contact_date: '2024-01-15T10:30:00Z',
      reaction_type: 'email_reply',
      reaction_content: 'Interest in product A expressed',
      sentiment_score: 0.85
    };

    const result = accumulateCustomerReactionAsLearningData({
      current_record_count: CURRENT_RECORD_COUNT,
      max_record_limit: MAX_LEARNING_DATA_RECORDS,
      new_reaction_data: {
        id: NEW_RECORD_ID,
        ...NEW_RECORD_CONTENT
      }
    });

    expect(result.final_record_count).toBe(MAX_LEARNING_DATA_RECORDS);
    expect(result.accumulated_record_id).toBe(NEW_RECORD_ID);
    expect(result.accumulated_record).toEqual({
      id: NEW_RECORD_ID,
      ...NEW_RECORD_CONTENT
    });
    expect(result.accumulation_status).toBe('success');
    expect(result.storage_capacity_reached).toBe(true);
  });
});