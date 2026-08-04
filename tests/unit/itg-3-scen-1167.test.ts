import { describe, test, expect } from '@jest/globals';
import { prioritizeProposalApproaches } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ優先順位付けロジック', () => {
  // SCEN-1167
  test('複数提案アプローチがスコア同一の場合、抽出元商談成功日時の新しい順で並べ替える', () => {
    const proposalApproachCandidates = [
      {
        id: 'approach_A',
        score: 0.85,
        extractedFromDealSuccessDate: new Date('2026-01-15T10:30:00Z'),
        approachName: 'パターンA',
      },
      {
        id: 'approach_B',
        score: 0.85,
        extractedFromDealSuccessDate: new Date('2026-01-20T14:45:00Z'),
        approachName: 'パターンB',
      },
      {
        id: 'approach_C',
        score: 0.85,
        extractedFromDealSuccessDate: new Date('2026-01-18T09:15:00Z'),
        approachName: 'パターンC',
      },
    ];

    const result = prioritizeProposalApproaches(proposalApproachCandidates);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('approach_B');
    expect(result[0].extractedFromDealSuccessDate).toEqual(
      new Date('2026-01-20T14:45:00Z')
    );
    expect(result[1].id).toBe('approach_C');
    expect(result[1].extractedFromDealSuccessDate).toEqual(
      new Date('2026-01-18T09:15:00Z')
    );
    expect(result[2].id).toBe('approach_A');
    expect(result[2].extractedFromDealSuccessDate).toEqual(
      new Date('2026-01-15T10:30:00Z')
    );
  });
});