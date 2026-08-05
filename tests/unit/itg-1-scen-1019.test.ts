import { validateComplianceGuidanceUnderstandingScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-1019: 成功パターン適用ガイドライン周知完了判定機能 - 理解度確認テストスコアが空文字列のとき処理がエラーになること', () => {
    // 理解度確認テストスコアパラメータに空文字列を設定
    const invalidScoreInput = '';

    // 完了判定処理を実行し、例外オブジェクトのキャッチを確認
    expect(() => validateComplianceGuidanceUnderstandingScore(invalidScoreInput)).toThrow(/INVALID_SCORE_FORMAT/);
  });
});