import { rankProposalApproaches } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1166
  test('複数提案アプローチの優先順位付け機能 - マッチスコアの高い順にランク付けして返却する', () => {
    const proposalApproaches = [
      {
        name: 'アプローチA',
        matchScore: 0.85,
      },
      {
        name: 'アプローチB',
        matchScore: 0.92,
      },
      {
        name: 'アプローチC',
        matchScore: 0.78,
      },
    ];

    const rankedApproaches = rankProposalApproaches(proposalApproaches);

    expect(rankedApproaches).toHaveLength(3);
    expect(rankedApproaches[0]).toEqual({
      name: 'アプローチB',
      matchScore: 0.92,
      rankPosition: 1,
    });
    expect(rankedApproaches[1]).toEqual({
      name: 'アプローチA',
      matchScore: 0.85,
      rankPosition: 2,
    });
    expect(rankedApproaches[2]).toEqual({
      name: 'アプローチC',
      matchScore: 0.78,
      rankPosition: 3,
    });
  });
});