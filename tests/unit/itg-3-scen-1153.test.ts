import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し提案アプローチを推奨する機能', () => {
  // SCEN-1153
  test('類似パターン検索 - 検索対象期間の開始日と終了日が同日のとき、該当日付の商談のみを対象にする', () => {
    const mockRecommendationEngine = {
      findSimilarPatterns: jest.fn((dealRecords, startDate, endDate) => {
        return dealRecords.filter(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          const start = new Date(startDate).toISOString().split('T')[0];
          const end = new Date(endDate).toISOString().split('T')[0];
          return recordDate >= start && recordDate <= end;
        });
      }),
    };

    const dealRecords = [
      {
        id: 'DEAL_A',
        date: '2024-01-15T10:00:00Z',
        status: 'won',
        customerName: '顧客A',
        amount: 1000000,
      },
      {
        id: 'DEAL_B',
        date: '2024-01-15T14:30:00Z',
        status: 'in_progress',
        customerName: '顧客B',
        amount: 500000,
      },
      {
        id: 'DEAL_C',
        date: '2024-01-14T09:00:00Z',
        status: 'won',
        customerName: '顧客C',
        amount: 750000,
      },
      {
        id: 'DEAL_D',
        date: '2024-01-16T11:00:00Z',
        status: 'won',
        customerName: '顧客D',
        amount: 1200000,
      },
    ];

    const searchStartDate = '2024-01-15T00:00:00Z';
    const searchEndDate = '2024-01-15T23:59:59Z';

    const result = findSimilarPatterns(
      dealRecords,
      searchStartDate,
      searchEndDate,
      mockRecommendationEngine
    );

    expect(result).toHaveLength(2);
    expect(result.map(r => r.id)).toEqual(['DEAL_A', 'DEAL_B']);
    expect(result.every(r => {
      const recordDate = new Date(r.date).toISOString().split('T')[0];
      return recordDate === '2024-01-15';
    })).toBe(true);
    expect(result).toContainEqual(
      expect.objectContaining({
        id: 'DEAL_A',
        status: 'won',
      })
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        id: 'DEAL_B',
        status: 'in_progress',
      })
    );
  });
});