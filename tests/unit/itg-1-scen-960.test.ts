import { calculateImprovementPriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-960: 改善優先度スコア算出機能 - 重複エントリが含まれるとき各パターンのスコアが個別に算出される', () => {
    // 重複を含む問題パターンリスト
    const problemPatterns = [
      { id: 'P001', severity: 'high', frequency: 10 },
      { id: 'P001', severity: 'high', frequency: 10 }
    ];

    // スコア算出ロジックを実行
    const result = calculateImprovementPriorityScores(problemPatterns);

    // 返却されたスコア配列の要素数が2つであることを確認
    expect(result).toHaveLength(2);

    // 各要素のスコア値が同一であることを確認（重複パターンは同じスコアで個別算出）
    const first_score = result[0].score;
    const second_score = result[1].score;
    expect(first_score).toBe(second_score);
    expect(first_score).toBe(85);

    // 各要素に対応するパターンIDを確認
    expect(result[0].pattern_id).toBe('P001');
    expect(result[1].pattern_id).toBe('P001');

    // severity と frequency が保持されていることを確認
    expect(result[0].severity).toBe('high');
    expect(result[0].frequency).toBe(10);
    expect(result[1].severity).toBe('high');
    expect(result[1].frequency).toBe(10);

    // リスト内の重複エントリが一意にマージされていないことを確認
    expect(result.length).toBe(problemPatterns.length);
  });
});