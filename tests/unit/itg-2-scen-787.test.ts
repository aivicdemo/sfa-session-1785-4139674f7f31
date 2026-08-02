import { sortDealRecordsByDate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能 - 商談記録の時系列並べ替え', () => {
  test('SCEN-787: 商談記録が逆順（新→旧）で入力された場合、時系列順（旧→新）に正しく並べ替えられる', () => {
    const deal_records = [
      {
        deal_id: 'D001',
        deal_date: new Date('2024-01-15T00:00:00Z'),
      },
      {
        deal_id: 'D002',
        deal_date: new Date('2024-01-10T00:00:00Z'),
      },
      {
        deal_id: 'D003',
        deal_date: new Date('2024-01-20T00:00:00Z'),
      },
      {
        deal_id: 'D004',
        deal_date: new Date('2024-01-05T00:00:00Z'),
      },
    ];

    const sorted_records = sortDealRecordsByDate(deal_records);

    expect(sorted_records).toEqual([
      {
        deal_id: 'D004',
        deal_date: new Date('2024-01-05T00:00:00Z'),
      },
      {
        deal_id: 'D002',
        deal_date: new Date('2024-01-10T00:00:00Z'),
      },
      {
        deal_id: 'D001',
        deal_date: new Date('2024-01-15T00:00:00Z'),
      },
      {
        deal_id: 'D003',
        deal_date: new Date('2024-01-20T00:00:00Z'),
      },
    ]);
  });
});