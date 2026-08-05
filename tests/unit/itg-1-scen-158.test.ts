import { calculateDeduplicatedLearningDataCount } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能 - 複数営業担当者学習データの重複除外', () => {
  // SCEN-158
  test('複数の営業担当者の学習データを集計するとき重複レコードが正確に除外される', () => {
    const salespersonAData = [
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-A',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-A',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-A',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-A',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-A',
      },
    ];

    const salespersonBData = [
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-B',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-B',
      },
      {
        customerId: 'CUST-001',
        projectAmount: 1000000,
        date: '2024-01-15',
        salespersonId: 'SP-B',
      },
    ];

    const salespersonCData = [
      {
        customerId: 'CUST-002',
        projectAmount: 500000,
        date: '2024-01-15',
        salespersonId: 'SP-C',
      },
      {
        customerId: 'CUST-002',
        projectAmount: 500000,
        date: '2024-01-15',
        salespersonId: 'SP-C',
      },
    ];

    const allLearningDataSets = [
      salespersonAData,
      salespersonBData,
      salespersonCData,
    ];

    const result = calculateDeduplicatedLearningDataCount(allLearningDataSets);

    expect(result.totalDedupedRecordCount).toBe(5);
    expect(result.cust001RecordCount).toBe(1);
    expect(result.cust002RecordCount).toBe(2);
    expect(result.deduplicationApplied).toBe(true);
  });
});