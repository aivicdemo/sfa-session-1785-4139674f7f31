import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-575
  test('営業プロセス実行状況データが欠落している場合、エラーになる', async () => {
    const missingProcessIdResponse = {
      processId: null,
      executionStatus: 'IN_PROGRESS',
      completedAt: '2024-01-15T11:00:00Z',
      assignedSalesPersonId: 'SP001',
      customerId: 'C001',
      dealId: 'D001'
    };

    fetchMock.mockResponseOnce(JSON.stringify(missingProcessIdResponse), {
      status: 200
    });

    const validateExecutionData = (data: {
      processId: string | null;
      executionStatus: string;
      completedAt: string;
      assignedSalesPersonId: string;
      customerId: string;
      dealId: string;
    }): void => {
      if (
        !data.processId ||
        !data.executionStatus ||
        !data.completedAt ||
        !data.assignedSalesPersonId ||
        !data.customerId ||
        !data.dealId
      ) {
        throw new Error('営業プロセス実行状況データが不完全です。必須項目を確認してください');
      }
    };

    await expect(async () => {
      const response = await fetch('/api/sales-process-execution');
      const data = await response.json();
      validateExecutionData(data);
    }).rejects.toThrow(/営業プロセス実行状況データが不完全です/);
  });
});