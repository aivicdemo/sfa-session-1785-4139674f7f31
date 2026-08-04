import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1198
  test('[normal] 提案妥当性判定機能 - 提案内容が営業制約条件を満たす場合に妥当と判定される', () => {
    const constraintConditions = {
      minimumOrderAmount: 1000000,
      applicableIndustries: ['manufacturing', 'distribution', 'service'],
      proposalLeadTimeDays: 3,
    };

    const proposalContent = {
      orderAmount: 1500000,
      targetIndustry: 'manufacturing',
      proposalLeadTimeDays: 5,
      successScoreRatio: 0.85,
    };

    const result = evaluateProposalViability(constraintConditions, proposalContent);

    expect(result.status).toBe('VALID');
    expect(result.isViable).toBe(true);
    expect(result.rationale).toBe(
      '受注金額が最小受注金額100万円以上（実績150万円）、対象業種が対応可能業種に該当（製造業）、提案リードタイムが最短3営業日以内（実績5営業日）であり、営業制約条件をすべて満たします',
    );
    expect(result.constraints).toEqual({
      orderAmountValidation: {
        constraint: 1000000,
        actual: 1500000,
        isSatisfied: true,
      },
      industryValidation: {
        constraint: ['manufacturing', 'distribution', 'service'],
        actual: 'manufacturing',
        isSatisfied: true,
      },
      leadTimeValidation: {
        constraint: 3,
        actual: 5,
        isSatisfied: true,
      },
    });
  });
});