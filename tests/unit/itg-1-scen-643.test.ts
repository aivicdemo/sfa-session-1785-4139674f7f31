import { analyzeActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-643
  test('[normal] 複数指標の乖離度が異なる場合、各指標ごとに独立して改善優先度が判定される', () => {
    const salesPersonId = 'SP_A';
    const visitCount = 85;
    const proposalCount = 92;
    const contractCount = 75;
    const baselineVisitCount = 100;
    const baselineProposalCount = 100;
    const baselineContractCount = 100;

    const result = analyzeActionPatternReport({
      salesPersonId,
      visitCount,
      proposalCount,
      contractCount,
      baselineVisitCount,
      baselineProposalCount,
      baselineContractCount,
    });

    const visitDeviation = ((visitCount - baselineVisitCount) / baselineVisitCount) * 100;
    const proposalDeviation = ((proposalCount - baselineProposalCount) / baselineProposalCount) * 100;
    const contractDeviation = ((contractCount - baselineContractCount) / baselineContractCount) * 100;

    expect(visitDeviation).toBe(-15);
    expect(proposalDeviation).toBe(-8);
    expect(contractDeviation).toBe(-25);

    expect(result.improvementItems).toHaveLength(3);

    expect(result.improvementItems[0]).toEqual({
      rank: 1,
      metric: 'contract_count',
      deviation: -25,
      description: '成約件数改善',
    });

    expect(result.improvementItems[1]).toEqual({
      rank: 2,
      metric: 'visit_count',
      deviation: -15,
      description: '訪問件数改善',
    });

    expect(result.improvementItems[2]).toEqual({
      rank: 3,
      metric: 'proposal_count',
      deviation: -8,
      description: '提案件数改善',
    });

    expect(result.salesPersonId).toBe('SP_A');
    expect(result.reportGeneratedAt).toBeDefined();
  });
});