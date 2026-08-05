import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { confirmSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセスログ抽出範囲確定機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-086
  test('営業部長の指示により対象営業担当者が1人で抽出範囲が確定される', async () => {
    const managerId = 'MGR-001';
    const managerRole = 'sales_director';
    const targetSalesreps = ['SALES-TANAKA-001'];
    const extractionStartDate = new Date('2024-01-01T00:00:00Z');
    const extractionEndDate = new Date('2024-01-31T23:59:00Z');
    const confirmationTimestamp = new Date('2024-01-15T11:00:00Z');

    const systemLogEntry = {
      confirmed_by_id: managerId,
      confirmed_at: confirmationTimestamp.toISOString(),
      target_count: 1,
      target_salesreps: targetSalesreps,
      extraction_period_start: extractionStartDate.toISOString(),
      extraction_period_end: extractionEndDate.toISOString(),
      event_type: 'extraction_range_confirmed',
    };

    const expectedResult = {
      status: 'confirmed',
      message: '範囲確定完了：対象者1人（SALES-TANAKA-001）、期間2024年1月1日～1月31日',
      target_count: 1,
      target_salesreps: targetSalesreps,
      extraction_period_start: extractionStartDate.toISOString(),
      extraction_period_end: extractionEndDate.toISOString(),
      confirmed_by_id: managerId,
      confirmed_at: confirmationTimestamp.toISOString(),
      can_proceed_to_extraction: true,
    };

    fetchMock.mockResponseOnce(JSON.stringify(systemLogEntry), { status: 201 });

    const result = await confirmSalesProcessLogExtractionRange({
      manager_id: managerId,
      manager_role: managerRole,
      target_salesreps: targetSalesreps,
      extraction_start_date: extractionStartDate,
      extraction_end_date: extractionEndDate,
      confirmation_timestamp: confirmationTimestamp,
    });

    expect(result.status).toBe('confirmed');
    expect(result.message).toContain('範囲確定完了');
    expect(result.message).toContain('対象者1人');
    expect(result.message).toContain('SALES-TANAKA-001');
    expect(result.message).toContain('2024年1月1日');
    expect(result.message).toContain('1月31日');
    expect(result.target_count).toBe(1);
    expect(result.target_salesreps).toEqual(['SALES-TANAKA-001']);
    expect(result.extraction_period_start).toBe('2024-01-01T00:00:00.000Z');
    expect(result.extraction_period_end).toBe('2024-01-31T23:59:00.000Z');
    expect(result.confirmed_by_id).toBe('MGR-001');
    expect(result.confirmed_at).toBe(confirmationTimestamp.toISOString());
    expect(result.can_proceed_to_extraction).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[0]).toContain('/system-log');
    expect(callArgs[1].method).toBe('POST');

    const requestBody = JSON.parse(callArgs[1].body);
    expect(requestBody.confirmed_by_id).toBe(managerId);
    expect(requestBody.target_count).toBe(1);
    expect(requestBody.event_type).toBe('extraction_range_confirmed');
  });
});