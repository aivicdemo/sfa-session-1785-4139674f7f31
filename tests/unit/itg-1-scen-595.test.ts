import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { auditDashboardAggregateByContractDate } from '../../src/logic/it-1';

fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-595: [edge] 複数営業案件が全く同じ成約日時を持つ重複データを含む場合
  test('同一成約日時の重複営業案件が正確にカウントされること', async () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
    });

    const contractDateTime = '2024-01-15T14:30:00Z';
    
    const mockDealData = [
      {
        dealId: 'DEAL-001',
        salesPersonId: 'SP-001',
        customerName: 'Customer A',
        contractDate: contractDateTime,
        contractAmount: 100000,
      },
      {
        dealId: 'DEAL-002',
        salesPersonId: 'SP-002',
        customerName: 'Customer B',
        contractDate: contractDateTime,
        contractAmount: 150000,
      },
      {
        dealId: 'DEAL-003',
        salesPersonId: 'SP-003',
        customerName: 'Customer C',
        contractDate: contractDateTime,
        contractAmount: 200000,
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockDealData), { status: 200 });

    const result = await auditDashboardAggregateByContractDate({
      apiEndpoint: 'https://api.example.com/deals',
      targetContractDate: contractDateTime,
    });

    expect(result.totalCount).toBe(3);
    expect(result.contractDateTime).toBe(contractDateTime);
    expect(result.deals).toHaveLength(3);
    expect(result.deals[0].dealId).toBe('DEAL-001');
    expect(result.deals[1].dealId).toBe('DEAL-002');
    expect(result.deals[2].dealId).toBe('DEAL-003');
    expect(result.displayText).toBe(`${contractDateTime}：3件`);
  });
});