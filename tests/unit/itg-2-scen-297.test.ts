import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-297
  test('同一営業担当者の複数商談でステップ順序が前後するとき、各商談の乖離パターンが正しく識別される', () => {
    const salesPersonId = 'SP001';
    const standardProcessSequence = ['接触', '提案', '受注'];

    const deal1 = {
      dealId: 'DEAL001',
      salesPersonId: salesPersonId,
      steps: [
        { stepName: '接触', executedDate: '2024-01-10' },
        { stepName: '提案', executedDate: '2024-01-20' },
        { stepName: '受注', executedDate: '2024-01-30' }
      ]
    };

    const deal2 = {
      dealId: 'DEAL002',
      salesPersonId: salesPersonId,
      steps: [
        { stepName: '接触', executedDate: '2024-02-05' },
        { stepName: '受注', executedDate: '2024-02-15' },
        { stepName: '提案', executedDate: '2024-02-10' }
      ]
    };

    const deals = [deal1, deal2];

    const result = calculateProcessComplianceScore(deals, standardProcessSequence);

    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.deals).toHaveLength(2);

    const deal1Result = result.deals.find((d: any) => d.dealId === 'DEAL001');
    expect(deal1Result).toBeDefined();
    expect(deal1Result.deviationPattern).toBe('なし');
    expect(deal1Result.isCompliant).toBe(true);

    const deal2Result = result.deals.find((d: any) => d.dealId === 'DEAL002');
    expect(deal2Result).toBeDefined();
    expect(deal2Result.deviationPattern).toBe('受注が提案より先行');
    expect(deal2Result.isCompliant).toBe(false);

    expect(result.deals[0].salesPersonId).toBe(salesPersonId);
    expect(result.deals[1].salesPersonId).toBe(salesPersonId);
  });
});