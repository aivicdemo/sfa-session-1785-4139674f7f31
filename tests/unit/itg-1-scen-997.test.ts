import { extractAndApproveFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-997: 成功要因と失敗要因が逆順で入力されるとき入力順序で処理される', () => {
    // 成功要因のリストを準備
    const success_factors = ['要因A', '要因B', '要因C'];
    // 失敗要因のリストを準備
    const failure_factors = ['要因X', '要因Y', '要因Z'];

    // 成功要因と失敗要因を逆順で入力（失敗要因を先に、成功要因を後に渡す）
    const result = extractAndApproveFactors(failure_factors, success_factors);

    // 処理結果のリスト順序を確認
    // 期待結果：失敗要因が逆順で入力されている場合でも、
    // 処理結果では成功要因が['要因A', '要因B', '要因C']の順序で、
    // 失敗要因が['要因X', '要因Y', '要因Z']の順序で整列され、
    // 入力順序（成功要因→失敗要因の分類順）で処理される

    expect(result).toEqual({
      success_factors: ['要因A', '要因B', '要因C'],
      failure_factors: ['要因X', '要因Y', '要因Z'],
      approved: true,
    });
  });
});