import { validateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1418
  test('提案内容と顧客制約条件の自動照合機能 - 提案金額が空のとき、照合結果が無効と判定される', () => {
    const proposal = {
      proposalAmount: '',
      proposalDescription: 'クラウド基盤構築サービス',
      proposalTimeline: '2024-06-30'
    };

    const customerConstraints = {
      minBudget: 1000000,
      maxBudget: 50000000,
      requiredDeliveryDate: '2024-12-31'
    };

    const result = validateProposalAgainstConstraints(proposal, customerConstraints);

    expect(result.isValid).toBe(false);
    expect(result.validationErrors).toContain('提案金額が空です');
    expect(result.matchingStatus).toBe('INVALID');
  });
});