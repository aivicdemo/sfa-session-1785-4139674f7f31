import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('提案資料と顧客ニーズの適合度スコア化機能', () => {
  // SCEN-738
  test('スコア計算に使用される各項目の配点が正しく適用される', () => {
    const input = {
      industryMatchPercentage: 100,
      proposalContentMatchPercentage: 80,
      budgetAlignmentPercentage: 60,
      deliveryResponsivenessPercentage: 90,
    };

    const result = calculateProposalNeedsAlignmentScore(input);

    expect(result.industryMatchScore).toBe(20);
    expect(result.proposalContentMatchScore).toBe(24);
    expect(result.budgetAlignmentScore).toBe(15);
    expect(result.deliveryResponsivenessScore).toBe(22.5);
    expect(result.totalScore).toBe(81.5);
  });
});