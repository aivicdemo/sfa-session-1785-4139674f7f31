import { calculateProposalNeedsAlignment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-730
  test('提案資料と顧客ニーズの適合度スコア化機能 - 同じ提案資料と顧客ニーズで2回実行しても、同じスコアと不適合項目が返される', () => {
    const proposalId = 'PROP-2024-001';
    const needsId = 'NEED-2024-050';

    const firstResult = calculateProposalNeedsAlignment({
      proposalId,
      needsId,
    });

    const secondResult = calculateProposalNeedsAlignment({
      proposalId,
      needsId,
    });

    expect(firstResult.alignmentScore).toBe(secondResult.alignmentScore);
    expect(firstResult.alignmentScore).toBe(87.5);
    expect(firstResult.mismatchedItems).toEqual(secondResult.mismatchedItems);
    expect(firstResult.mismatchedItems).toEqual([
      '要件A_価格帯不一致',
      '要件C_納期対応不可',
    ]);
  });
});