import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1192
  test('[normal] 提案妥当性判定機能 - 営業プロセスが標準フローの場合に妥当性判定が実行される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '初期接触後のニーズ把握を徹底し、顧客課題に基づいた提案を実施',
        reasoning: [
          '顧客業種：製造業、規模：従業員500名',
          '購買タイミング：年度末予算確定後',
          '過去類似案件の成功率：78%'
        ],
        confidenceScore: 82
      })
    };

    const proposalData = {
      proposalId: 'PROP-20240115-001',
      dealId: 'DEAL-20240115-001',
      salesProcess: 'standard_flow',
      stage: 'needs_assessment',
      customerIndustry: 'manufacturing',
      customerSize: 500,
      proposalContent: '業務効率化ソリューション提案',
      targetAmount: 1500000,
      timeline: '2024年3月末'
    };

    const result = evaluateProposalValidity(proposalData, mockAIEngine);

    expect(result.status).toBe('completed');
    expect(result.proposalApproach).toBe('初期接触後のニーズ把握を徹底し、顧客課題に基づいた提案を実施');
    expect(result.reasoning).toEqual([
      '顧客業種：製造業、規模：従業員500名',
      '購買タイミング：年度末予算確定後',
      '過去類似案件の成功率：78%'
    ]);
    expect(result.confidenceScore).toBe(82);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith({
      dealId: 'DEAL-20240115-001',
      salesProcess: 'standard_flow',
      stage: 'needs_assessment',
      customerIndustry: 'manufacturing',
      customerSize: 500
    });
  });
});