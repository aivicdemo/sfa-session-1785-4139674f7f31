import { validateDeterminedResponseAction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-835: 対応必要性の判定結果が定義された列挙値の範囲外である場合にエラーになること", () => {
    // 対応必要性の判定結果に定義された列挙値の範囲外の値を設定
    const invalidJudgmentValue = "INVALID_STATUS";

    // 判定結果の妥当性を検証する関数を実行し、エラーハンドリング処理を確認
    const result = () =>
      validateDeterminedResponseAction({
        determinedResponseAction: invalidJudgmentValue,
      });

    // 対応必要性の判定結果が列挙値の範囲外の値の場合、エラーコード 'INVALID_JUDGMENT_VALUE' を含むエラーオブジェクトがスローされることを検証
    expect(result).toThrow(/INVALID_JUDGMENT_VALUE/);

    // エラーメッセージが「対応必要性の判定結果が無効です。許可された値: [REQUIRED, NOT_REQUIRED, PENDING]」と表示されることを検証
    expect(result).toThrow(
      /対応必要性の判定結果が無効です。許可された値: \[REQUIRED, NOT_REQUIRED, PENDING\]/
    );
  });
});