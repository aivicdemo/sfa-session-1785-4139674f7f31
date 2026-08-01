import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-646
  test('成約実績データの成約金額が0円の場合、成約件数として正常にカウントされる', () => {
    const salesRepId = 'REP-001';
    const contractedDeals = [
      {
        id: 'DEAL-001',
        salesRepId: salesRepId,
        contractAmount: 100000,
        contractDate: '2024-01-15',
        status: 'completed'
      },
      {
        id: 'DEAL-002',
        salesRepId: salesRepId,
        contractAmount: 0,
        contractDate: '2024-01-20',
        status: 'completed'
      },
      {
        id: 'DEAL-003',
        salesRepId: salesRepId,
        contractAmount: 50000,
        contractDate: '2024-01-25',
        status: 'completed'
      }
    ];

    const result = generateSalesPatternAnalysisReport({
      contractedDeals: contractedDeals,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31'
    });

    const targetRepReport = result.reportByRep.find(
      (rep) => rep.salesRepId === salesRepId
    );

    expect(targetRepReport).toBeDefined();
    expect(targetRepReport!.contractCount).toBe(3);
    expect(targetRepReport!.totalContractAmount).toBe(150000);
  });
});