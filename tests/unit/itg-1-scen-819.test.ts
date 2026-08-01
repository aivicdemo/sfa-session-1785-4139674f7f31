import { analyzeSalesmanBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-819
  test('成約実績の金額が0円の場合、その成約実績を計算対象外として扱う', () => {
    const salesmanId = 'SALESMAN-001';
    const contractResults = [
      {
        id: 'CONTRACT-A',
        amount: 100000,
        contractDate: '2024-01-15',
        salesmanId: salesmanId,
      },
      {
        id: 'CONTRACT-B',
        amount: 0,
        contractDate: '2024-01-20',
        salesmanId: salesmanId,
      },
      {
        id: 'CONTRACT-C',
        amount: 50000,
        contractDate: '2024-01-25',
        salesmanId: salesmanId,
      },
    ];

    const result = analyzeSalesmanBehaviorPattern({
      salesmanId: salesmanId,
      contractResults: contractResults,
    });

    expect(result.includedContractCount).toBe(2);
    expect(result.totalAmount).toBe(150000);
    expect(result.excludedZeroAmountCount).toBe(1);
    expect(result.averageAmount).toBe(75000);
    expect(result.includedContractIds).toEqual(['CONTRACT-A', 'CONTRACT-C']);
  });
});