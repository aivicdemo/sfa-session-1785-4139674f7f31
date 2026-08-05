import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-248: [edge] 標準プロセス遵守度スコア計算機能 - 遵守度スコアが閾値100%超（100.1%）のとき例外が発生する', () => {
    // 手順: 標準プロセス遵守度スコア計算機能のテストを初期化する
    // 遵守度スコアの入力値を100.1%に設定する
    const compliance_score_input = 100.1;

    // 手順: 遵守度スコア計算関数を実行する
    // 期待結果: 遵守度スコアが100%を超過する100.1%の値で計算実行時に、
    // 『遵守度スコアは100%以下である必要があります』というメッセージを含むRangeErrorが発生する
    expect(() => {
      calculateProcessComplianceScore(compliance_score_input);
    }).toThrow(/遵守度スコアは100%以下である必要があります/);
  });
});