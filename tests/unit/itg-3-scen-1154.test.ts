import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1154
  test('過去成功商談の検索期間が月末をまたぐとき、正しく期間内データを抽出する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const pastDealData = [
      {
        deal_id: 'D001',
        closed_date: '2025-01-15',
        amount: 1000000,
        status: 'success',
      },
      {
        deal_id: 'D002',
        closed_date: '2025-01-28',
        amount: 2500000,
        status: 'success',
      },
      {
        deal_id: 'D003',
        closed_date: '2025-01-31',
        amount: 1800000,
        status: 'success',
      },
      {
        deal_id: 'D004',
        closed_date: '2025-02-01',
        amount: 3200000,
        status: 'success',
      },
      {
        deal_id: 'D005',
        closed_date: '2025-02-05',
        amount: 1500000,
        status: 'success',
      },
    ];

    const filterCriteria = {
      status: 'success',
      start_date: '2025-01-28',
      end_date: '2025-02-03',
    };

    const result = findSimilarPatterns(
      pastDealData,
      filterCriteria,
      mockAIEngine
    );

    expect(result).toEqual([
      {
        deal_id: 'D002',
        closed_date: '2025-01-28',
        amount: 2500000,
        status: 'success',
      },
      {
        deal_id: 'D003',
        closed_date: '2025-01-31',
        amount: 1800000,
        status: 'success',
      },
      {
        deal_id: 'D004',
        closed_date: '2025-02-01',
        amount: 3200000,
        status: 'success',
      },
    ]);

    expect(result).toHaveLength(3);
  });
});