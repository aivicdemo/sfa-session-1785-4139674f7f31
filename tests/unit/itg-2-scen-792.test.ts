import { analyzeProcessExecution } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  // SCEN-792
  test('分析対象期間が月をまたぐ場合、全期間の記録が正しく集計される', () => {
    const analysisStartDate = new Date('2024-01-15T00:00:00Z');
    const analysisEndDate = new Date('2024-02-10T23:59:59Z');

    const salesRecords = [
      {
        recordDate: new Date('2024-01-20T10:00:00Z'),
        dealCount: 3,
        closedDealCount: 1,
      },
      {
        recordDate: new Date('2024-01-31T14:30:00Z'),
        dealCount: 2,
        closedDealCount: 0,
      },
      {
        recordDate: new Date('2024-02-05T09:15:00Z'),
        dealCount: 4,
        closedDealCount: 2,
      },
      {
        recordDate: new Date('2024-02-10T16:45:00Z'),
        dealCount: 1,
        closedDealCount: 1,
      },
    ];

    const result = analyzeProcessExecution({
      analysisStartDate,
      analysisEndDate,
      salesRecords,
    });

    expect(result.totalDealCount).toBe(10);
    expect(result.totalClosedDealCount).toBe(4);
    expect(result.closingRate).toBe(40);

    expect(result.monthlyBreakdown).toEqual([
      {
        month: '2024-01',
        dealCount: 5,
        closedDealCount: 1,
      },
      {
        month: '2024-02',
        dealCount: 5,
        closedDealCount: 3,
      },
    ]);
  });
});