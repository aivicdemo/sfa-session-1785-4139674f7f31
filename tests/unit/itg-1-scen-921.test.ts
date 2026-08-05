import { calculateMonthlyTeamSalesStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-921
  test('チーム営業品質月次分析機能 - 重複レコードを含むデータセットで統計値が正しく計算される', () => {
    const salesRecords = [
      { salesPersonId: 'A', customerId: 'C001', salesAmount: 50000, date: '2024-01-15' },
      { salesPersonId: 'A', customerId: 'C002', salesAmount: 75000, date: '2024-01-10' },
      { salesPersonId: 'A', customerId: 'C003', salesAmount: 25000, date: '2024-01-20' },
      { salesPersonId: 'A', customerId: 'C004', salesAmount: 60000, date: '2024-01-05' },
      { salesPersonId: 'A', customerId: 'C005', salesAmount: 40000, date: '2024-01-25' },
      { salesPersonId: 'A', customerId: 'C006', salesAmount: 55000, date: '2024-01-08' },
      { salesPersonId: 'A', customerId: 'C007', salesAmount: 30000, date: '2024-01-12' },
      { salesPersonId: 'A', customerId: 'C008', salesAmount: 45000, date: '2024-01-18' },
      { salesPersonId: 'A', customerId: 'C009', salesAmount: 35000, date: '2024-01-22' },
      { salesPersonId: 'A', customerId: 'C010', salesAmount: 20000, date: '2024-01-28' },
      { salesPersonId: 'A', customerId: 'C001', salesAmount: 50000, date: '2024-01-15' },
      { salesPersonId: 'A', customerId: 'C001', salesAmount: 50000, date: '2024-01-15' },
    ];

    const result = calculateMonthlyTeamSalesStatistics(salesRecords);

    expect(result).toEqual({
      salesPersonId: 'A',
      totalSalesAmount: 150000,
      transactionCount: 13,
      averageSalesAmount: 11538,
    });
  });
});