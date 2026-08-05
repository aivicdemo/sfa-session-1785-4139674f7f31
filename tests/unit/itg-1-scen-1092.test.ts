import { analyzeSalesActivityPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1092
  test('営業担当者1人の場合、その担当者の行動パターン分析結果が正しく計算される', () => {
    const salesRepId = 'SA001';
    const salesRepName = '山田太郎';
    const totalActivityCount = 10;
    const initialVisitCount = 5;
    const proposalSendCount = 3;
    const contractCount = 2;
    const avgDaysInitialVisitToProposal = 5;
    const avgDaysProposalToContract = 10;
    const processCompliantCount = 2;
    const processDeviationCount = 8;
    const processDeviationRate = 80;

    const analysisInput = {
      salesRepId,
      salesRepName,
      totalActivityCount,
      initialVisitCount,
      proposalSendCount,
      contractCount,
      avgDaysInitialVisitToProposal,
      avgDaysProposalToContract,
      analysisPeriodStartDate: '2024-01-01',
      analysisPeriodEndDate: '2024-01-31',
    };

    const result = analyzeSalesActivityPattern(analysisInput);

    expect(result).toEqual({
      targetSalesRepCount: 1,
      salesRepId,
      salesRepName,
      totalActivityCount,
      initialVisitCount,
      initialVisitPercentage: 50,
      proposalSendCount,
      proposalSendPercentage: 30,
      contractCount,
      contractPercentage: 20,
      avgDaysInitialVisitToProposal,
      avgDaysProposalToContract,
      processCompliantCount,
      processDeviationCount,
      processDeviationRate,
      analysisCompletedAt: expect.any(String),
    });

    expect(result.targetSalesRepCount).toBe(1);
    expect(result.salesRepId).toBe('SA001');
    expect(result.salesRepName).toBe('山田太郎');
    expect(result.totalActivityCount).toBe(10);
    expect(result.initialVisitCount).toBe(5);
    expect(result.initialVisitPercentage).toBe(50);
    expect(result.proposalSendCount).toBe(3);
    expect(result.proposalSendPercentage).toBe(30);
    expect(result.contractCount).toBe(2);
    expect(result.contractPercentage).toBe(20);
    expect(result.avgDaysInitialVisitToProposal).toBe(5);
    expect(result.avgDaysProposalToContract).toBe(10);
    expect(result.processCompliantCount).toBe(2);
    expect(result.processDeviationCount).toBe(8);
    expect(result.processDeviationRate).toBe(80);
  });
});