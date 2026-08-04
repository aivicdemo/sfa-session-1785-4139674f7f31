import { calculatePriorityRank } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-528: [edge] 改善優先度ランク算出機能 - 優先度判定対象が複数件で順序が逆のとき正序に並び替えられる
  test('複数件の優先度判定対象が逆順で入力された場合、スコアに基づいて昇順に正序に並び替えられる', () => {
    const input_priority_targets = [
      { id: '3', score: 0.95, rank: null },
      { id: '2', score: 0.65, rank: null },
      { id: '1', score: 0.45, rank: null }
    ];

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn((target: any) => target.score)
    };

    const result = calculatePriorityRank(input_priority_targets, mock_ai_engine);

    expect(result).toEqual([
      { id: '1', score: 0.45, rank: 1 },
      { id: '2', score: 0.65, rank: 2 },
      { id: '3', score: 0.95, rank: 3 }
    ]);

    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('3');
  });
});