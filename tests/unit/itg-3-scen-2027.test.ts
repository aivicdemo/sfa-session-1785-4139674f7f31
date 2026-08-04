import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { calculateProposalViabilityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2027
  test('経営層向け説得資料の自動生成機能 - 競争優位性スコア欠落時に寄与を0として計算', () => {
    const proposalViabilityInput = {
      marketSizeScore: 80,
      customerNeedsFitness: 75,
      roiExpectationValue: 70,
      competitiveAdvantageScore: undefined,
    };

    const result = calculateProposalViabilityScore(proposalViabilityInput);

    expect(result.totalScore).toBe(56.25);
    expect(result.contributionByItem.marketSizeScore).toBe(80);
    expect(result.contributionByItem.customerNeedsFitness).toBe(75);
    expect(result.contributionByItem.roiExpectationValue).toBe(70);
    expect(result.contributionByItem.competitiveAdvantageScore).toBe(0);
  });
});