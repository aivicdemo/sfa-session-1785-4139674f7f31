import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  recordCustomerReactionAsLearningData,
} from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類・記録機能', () => {
  let learningDataStorage: Array<{
    classificationType: string;
    content: string;
    customerId: string;
    recordedAt: string;
  }>;

  beforeEach(() => {
    learningDataStorage = [];
  });

  afterEach(() => {
    learningDataStorage = [];
  });

  // SCEN-422
  test('単一の顧客反応がAIエージェントの学習データとして蓄積される', () => {
    const customerReaction = {
      classificationTypeCode: 'objection',
      content: '予算が限定的',
      customerId: 'CUST-001',
      recordedAt: new Date('2024-01-15T09:30:00Z').toISOString(),
    };

    const result = recordCustomerReactionAsLearningData(
      customerReaction,
      learningDataStorage
    );

    expect(result.storedCount).toBe(1);
    expect(result.duplicateDetected).toBe(false);
    expect(learningDataStorage).toHaveLength(1);
    expect(learningDataStorage[0]).toEqual({
      classificationType: 'objection',
      content: '予算が限定的',
      customerId: 'CUST-001',
      recordedAt: customerReaction.recordedAt,
    });
  });
});