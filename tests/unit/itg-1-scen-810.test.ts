import { classifyDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-810
  test('問題検出結果の重要度・優先度分類機能 - 問題リストが優先度の逆順で入力された場合、出力は正しい優先度順に並ぶ', () => {
    const input_problems = [
      { id: '1', title: '軽微な入力エラー', priority: 1 },
      { id: '2', title: '売上計上のズレ', priority: 2 },
      { id: '3', title: 'データベース接続失敗', priority: 3 },
    ];

    const result = classifyDetectedProblems(input_problems);

    expect(result).toEqual([
      { id: '3', title: 'データベース接続失敗', priority: 3 },
      { id: '2', title: '売上計上のズレ', priority: 2 },
      { id: '1', title: '軽微な入力エラー', priority: 1 },
    ]);
    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('1');
  });
});