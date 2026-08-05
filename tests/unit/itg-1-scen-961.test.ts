import { validateSuccessFactorApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-961: 成功要因・失敗要因の抽出と承認基準検証 - ワークショップで抽出された単一の成功要因が営業部長の承認基準を満たすと判定される', () => {
    // 準備: ワークショップから抽出された成功要因オブジェクト
    const extracted_success_factor = {
      factor_name: '顧客ニーズの事前ヒアリング',
      category: '営業プロセス',
      evaluation_score: 8,
    };

    // 準備: 営業部長の承認基準定義
    const manager_approval_criteria = {
      minimum_evaluation_score: 7,
      allowed_categories: ['営業プロセス', '顧客関係', '提案力'],
    };

    // 実行: 成功要因の承認基準検証メソッドを呼び出す
    const validation_result = validateSuccessFactorApprovalCriteria(
      extracted_success_factor,
      manager_approval_criteria,
    );

    // 検証: 期待結果
    expect(validation_result.is_approved_by_manager).toBe(true);
    expect(validation_result.approval_reason).toBe(
      '評価スコア8は基準値7以上を満たし、カテゴリ営業プロセスは許可カテゴリに含まれるため承認基準を満たします',
    );
  });
});