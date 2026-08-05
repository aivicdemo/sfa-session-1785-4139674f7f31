import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  // SCEN-1072
  test('営業活動が存在しない場合にエラーが発生する', () => {
    const salesActivities: Array<{
      id: string;
      salesPersonId: string;
      customerId: string;
      activityType: string;
      activityDate: Date;
      duration: number;
    }> = [];

    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    expect(() => {
      selectAnalysisIndicators(
        salesActivities,
        analysisStartDate,
        analysisEndDate
      );
    }).toThrow(/営業活動データが存在しません/);

    let errorThrown: Error | null = null;
    try {
      selectAnalysisIndicators(
        salesActivities,
        analysisStartDate,
        analysisEndDate
      );
    } catch (err) {
      errorThrown = err as Error;
    }

    expect(errorThrown).not.toBeNull();
    expect(errorThrown).toHaveProperty('message');
    if (errorThrown && typeof errorThrown === 'object') {
      const errorObj = errorThrown as Record<string, unknown>;
      if ('code' in errorObj) {
        expect(errorObj.code).toBe('4001');
      }
      if ('type' in errorObj) {
        const errorType = errorObj.type as string;
        expect(
          ['DataNotFoundError', '4001'].includes(errorType)
        ).toBeTruthy();
      }
    }
  });
});