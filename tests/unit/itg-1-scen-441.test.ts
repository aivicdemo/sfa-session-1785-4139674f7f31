import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordCustomerResponseClassifications } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類記録機能', () => {
  let mockDatabase: any;
  let recordedTimestamp: Date;

  beforeEach(() => {
    recordedTimestamp = new Date('2024-01-15T10:30:00Z');
    mockDatabase = {
      classifications: [] as any[],
      query: jest.fn((sql: string) => {
        if (sql.includes('SELECT COUNT')) {
          return { count: mockDatabase.classifications.length };
        }
        return mockDatabase.classifications;
      }),
      insert: jest.fn((data: any[]) => {
        mockDatabase.classifications.push(...data);
        return { success: true, insertedCount: data.length };
      }),
      reset: jest.fn(() => {
        mockDatabase.classifications = [];
      })
    };
  });

  afterEach(() => {
    mockDatabase.reset();
  });

  // SCEN-441
  test('顧客反応の分類パターンが最大許容値直下のとき記録される', () => {
    const MAX_CLASSIFICATION_PATTERNS = 999;
    const classificationPatterns: Array<{
      responseId: string;
      customerId: string;
      classificationPattern: string;
      classificationCode: number;
      responseText: string;
    }> = [];

    for (let i = 0; i < MAX_CLASSIFICATION_PATTERNS; i++) {
      classificationPatterns.push({
        responseId: `resp_${String(i).padStart(4, '0')}`,
        customerId: `cust_${String((i % 100) + 1).padStart(3, '0')}`,
        classificationPattern: `pattern_${String(i).padStart(4, '0')}`,
        classificationCode: i,
        responseText: `Customer response text for pattern ${i}`
      });
    }

    const result = recordCustomerResponseClassifications(
      classificationPatterns,
      mockDatabase,
      recordedTimestamp
    );

    expect(result.success).toBe(true);
    expect(result.insertedCount).toBe(999);
    expect(result.status).toBe('completed');

    const storedClassifications = mockDatabase.classifications;
    expect(storedClassifications.length).toBe(999);

    const uniqueResponseIds = new Set(storedClassifications.map((c: any) => c.responseId));
    expect(uniqueResponseIds.size).toBe(999);

    for (let i = 0; i < MAX_CLASSIFICATION_PATTERNS; i++) {
      const stored = storedClassifications[i];
      const original = classificationPatterns[i];

      expect(stored.responseId).toBe(original.responseId);
      expect(stored.customerId).toBe(original.customerId);
      expect(stored.classificationPattern).toBe(original.classificationPattern);
      expect(stored.classificationCode).toBe(original.classificationCode);
      expect(stored.responseText).toBe(original.responseText);
      expect(new Date(stored.recordedAt)).toEqual(recordedTimestamp);
      expect(stored.recordStatus).toBe('completed');
    }

    const duplicateCheck = mockDatabase.query('SELECT COUNT(*) FROM classifications');
    expect(duplicateCheck.count).toBe(999);
  });
});