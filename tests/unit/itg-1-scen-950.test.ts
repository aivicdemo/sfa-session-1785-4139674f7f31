import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-950: 改善優先度スコア算出機能 - 問題パターンが undefined のとき処理がエラーになる', () => {
    // 準備: 改善優先度スコア算出機能の入力パラメータを用意
    const issuePattern = undefined;
    const salesImpactDegree = 0.8; // 売上影響度: 0.0～1.0
    const occurrenceFrequency = 0.6; // 発生頻度: 0.0～1.0
    const improvementEffort = 0.5; // 改善工数: 0.0～1.0

    // 実行・検証: 問題パターンが undefined のため throw されることを確認
    expect(() =>
      calculateImprovementPriorityScore({
        issuePattern,
        salesImpactDegree,
        occurrenceFrequency,
        improvementEffort,
      })
    ).toThrow(/issuePattern|問題パターン/);
  });
});