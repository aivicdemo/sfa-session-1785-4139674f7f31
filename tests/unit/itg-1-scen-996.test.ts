import { evaluateSuccessFailureFactorsWithApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-996: 成功要因・失敗要因の抽出と承認基準判定機能 - 成功要因と失敗要因のリストが同じ順序で入力されるとき順序を維持して処理される', () => {
    // 手順: 成功要因リスト ['要因A', '要因B', '要因C'] を準備する
    const success_factors = ['要因A', '要因B', '要因C'];

    // 手順: 失敗要因リスト ['要因A', '要因B', '要因C'] を準備する
    const failure_factors = ['要因A', '要因B', '要因C'];

    // 手順: 両リストを成功要因・失敗要因の抽出と承認基準判定機能に入力する
    const result = evaluateSuccessFailureFactorsWithApprovalCriteria({
      success_factors,
      failure_factors,
    });

    // 期待結果: 処理結果の成功要因リストが ['要因A', '要因B', '要因C'] の順序を維持し、失敗要因リストも ['要因A', '要因B', '要因C'] の順序を維持して出力される
    expect(result.success_factors).toEqual(['要因A', '要因B', '要因C']);
    expect(result.failure_factors).toEqual(['要因A', '要因B', '要因C']);
  });
});