import { calculateProblemSeverityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-859: [edge] 問題検出結果の重要度・根拠・対応必要性判定機能 - 重要度スコアの計算で端数が発生するとき丸め処理が正確に行われる
  test('重要度スコア計算において端数が発生する場合、小数第2位で正確に丸め処理される', () => {
    // 手順: 重要度スコア計算の対象となる問題検出結果を準備する
    // 複数の評価項目の加重平均により端数が発生する条件を設定
    // 項目A（スコア8.5、重み0.4）+ 項目B（スコア7.2、重み0.6）= 7.7200...
    const evaluation_items = [
      {
        item_id: 'item_a',
        score: 8.5,
        weight: 0.4,
      },
      {
        item_id: 'item_b',
        score: 7.2,
        weight: 0.6,
      },
    ];

    const problem_detection_result = {
      problem_id: 'prob_001',
      evaluation_items: evaluation_items,
    };

    // 重要度スコア計算関数を実行する
    const calculated_result = calculateProblemSeverityScore(problem_detection_result);

    // 期待値の計算:
    // 加重平均 = (8.5 * 0.4) + (7.2 * 0.6)
    //          = 3.4 + 4.32
    //          = 7.72
    // 小数第2位で四捨五入 → 7.72
    const expected_severity_score = 7.72;

    // 計算結果の丸め処理ロジック（小数第2位）の出力値を取得する
    expect(calculated_result.severity_score).toBe(expected_severity_score);

    // 丸め結果が期待値と一致することを確認する
    // 端数処理後のスコアが7.72固定で保持される
    expect(calculated_result.severity_score).toStrictEqual(7.72);

    // 後続の対応必要性判定処理で7.72を参照値として使用可能であることを確認
    expect(typeof calculated_result.severity_score).toBe('number');
    expect(calculated_result.severity_score).toBeGreaterThanOrEqual(7.71);
    expect(calculated_result.severity_score).toBeLessThanOrEqual(7.73);
  });
});