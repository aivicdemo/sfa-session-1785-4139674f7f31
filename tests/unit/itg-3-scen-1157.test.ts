import { filterHistoricalDealsWithCustomerMasterValidation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1157
  test('[edge] 過去商談データフィルタリング機能 - 顧客マスタと商談データの顧客IDが不一致のレコードが混在するとき、該当レコードを除外する', () => {
    // テストデータ: 顧客マスタ
    const customerMasterRecords = [
      { customerId: 'C001', customerName: 'Company A', industry: 'IT' },
      { customerId: 'C002', customerName: 'Company B', industry: 'Finance' },
      { customerId: 'C003', customerName: 'Company C', industry: 'Healthcare' },
    ];

    // テストデータ: 商談データ
    const dealRecords = [
      { dealId: 'D001', customerId: 'C001', dealAmount: 500000 }, // 一致
      { dealId: 'D002', customerId: 'C002', dealAmount: 750000 }, // 一致
      { dealId: 'D003', customerId: 'C004', dealAmount: 600000 }, // 不一致：マスタに存在しない
      { dealId: 'D004', customerId: 'C001', dealAmount: 450000 }, // 一致
      { dealId: 'D005', customerId: 'C005', dealAmount: 800000 }, // 不一致：マスタに存在しない
    ];

    // 過去商談データフィルタリング機能を実行
    const filteredDeals = filterHistoricalDealsWithCustomerMasterValidation(
      dealRecords,
      customerMasterRecords
    );

    // フィルタリング後の商談データレコード数を確認
    expect(filteredDeals).toHaveLength(3);

    // フィルタリング後の商談データに含まれる顧客IDを確認
    const filteredCustomerIds = filteredDeals.map((deal) => deal.customerId);
    expect(filteredCustomerIds).toEqual(['C001', 'C002', 'C001']);

    // 除外されたレコード（C004、C005）が含まれていないことを確認
    expect(filteredCustomerIds).not.toContain('C004');
    expect(filteredCustomerIds).not.toContain('C005');

    // 残存するレコードのdealIdを確認
    const filteredDealIds = filteredDeals.map((deal) => deal.dealId);
    expect(filteredDealIds).toEqual(['D001', 'D002', 'D004']);
  });
});