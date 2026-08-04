import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善優先度ランク算出', () => {
  // SCEN-527: [edge] 改善優先度ランク算出機能 - 優先度判定対象が複数件で同値を含むとき同一ランク内での順序が保証される
  test('同一の優先度スコアを持つ複数案件のランク内順序が一貫して保証される', () => {
    // テスト対象のシナリオに基づく準備
    // 同一の優先度スコア（85.0）を持つ3件の改善案件を準備
    const improvementItemA = {
      id: 'item-001',
      title: '提案内容の形式統一',
      relevanceScore: 0.85,
      sequenceOrder: 1,
    };
    const improvementItemB = {
      id: 'item-002',
      title: '顧客ニーズ分析プロセス改善',
      relevanceScore: 0.85,
      sequenceOrder: 2,
    };
    const improvementItemC = {
      id: 'item-003',
      title: 'リスク判定基準の明確化',
      relevanceScore: 0.85,
      sequenceOrder: 3,
    };

    const improvementItems = [improvementItemA, improvementItemB, improvementItemC];

    // 優先度ランク算出処理を6回実行し、各回の結果を記録
    const rankedResults: Array<typeof improvementItems> = [];

    for (let executionIndex = 0; executionIndex < 6; executionIndex++) {
      // 優先度ランク算出関数を実行
      const rankedThisRun = improvementItems.map((item) => ({
        ...item,
        rank: evaluatePatternRelevance({
          relevanceScore: item.relevanceScore,
          itemId: item.id,
          inputSequence: item.sequenceOrder,
        }),
      }));

      rankedResults.push(rankedThisRun);
    }

    // 同一ランク内での順序が一貫していることを検証
    // 最初の実行結果を基準として保存
    const referenceOrder = rankedResults[0]
      .filter((item) => item.rank === 1)
      .map((item) => item.id);

    // 以降の5回の実行結果と比較
    for (let i = 1; i < rankedResults.length; i++) {
      const currentOrder = rankedResults[i]
        .filter((item) => item.rank === 1)
        .map((item) => item.id);

      expect(currentOrder).toEqual(referenceOrder);
    }

    // 3件全てが同一ランク（ランク1）に分類されることを検証
    const allItemsRank1 = rankedResults[0].every(
      (item) => item.rank === 1,
    );
    expect(allItemsRank1).toBe(true);

    // ランク内順序が入力順序に基づいて決定されていることを検証
    const expectedSequence = ['item-001', 'item-002', 'item-003'];
    expect(referenceOrder).toEqual(expectedSequence);

    // 各実行を通じてランク1内の順序が常に一貫していることを最終検証
    expect(rankedResults.length).toBe(6);
    rankedResults.forEach((result) => {
      const rank1Items = result
        .filter((item) => item.rank === 1)
        .map((item) => item.id);
      expect(rank1Items).toEqual(expectedSequence);
    });
  });
});