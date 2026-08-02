import { analyzeExecutionStatusByPeriod } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析エンジン', () => {
  // SCEN-849
  test('分析対象期間の開始日と終了日が同日のとき、当該1日のデータのみが対象となる', () => {
    const analysisDate = new Date('2024-01-15T00:00:00Z');
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-15T23:59:59Z');

    const sampleRecords = [
      {
        date: new Date('2024-01-14T10:30:00Z'),
        salesPersonId: 'SP001',
        processStep: 'INITIAL_CONTACT',
        dealId: 'DEAL001',
        status: 'COMPLETED',
      },
      {
        date: new Date('2024-01-15T09:00:00Z'),
        salesPersonId: 'SP002',
        processStep: 'PROPOSAL',
        dealId: 'DEAL002',
        status: 'COMPLETED',
      },
      {
        date: new Date('2024-01-15T14:30:00Z'),
        salesPersonId: 'SP001',
        processStep: 'NEGOTIATION',
        dealId: 'DEAL003',
        status: 'COMPLETED',
      },
      {
        date: new Date('2024-01-15T16:45:00Z'),
        salesPersonId: 'SP003',
        processStep: 'CLOSING',
        dealId: 'DEAL004',
        status: 'COMPLETED',
      },
      {
        date: new Date('2024-01-16T08:00:00Z'),
        salesPersonId: 'SP002',
        processStep: 'INITIAL_CONTACT',
        dealId: 'DEAL005',
        status: 'COMPLETED',
      },
    ];

    const result = analyzeExecutionStatusByPeriod({
      startDate,
      endDate,
      records: sampleRecords,
    });

    expect(result.recordCount).toBe(3);
    expect(result.dateRangeDisplay).toBe('2024/01/15～2024/01/15');
    expect(result.filteredRecords).toHaveLength(3);
    expect(result.filteredRecords[0].dealId).toBe('DEAL002');
    expect(result.filteredRecords[1].dealId).toBe('DEAL003');
    expect(result.filteredRecords[2].dealId).toBe('DEAL004');
    expect(result.filteredRecords.every((r) => r.date >= startDate && r.date <= endDate)).toBe(
      true
    );
  });
});