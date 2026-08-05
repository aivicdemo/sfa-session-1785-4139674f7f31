import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateSuccessFactorApproval } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-977: [error] 成功要因・失敗要因の抽出と承認判定機能 - 営業管理職の権限がないユーザーが操作したとき、処理が進まずエラーになる
  test('営業管理職以外の権限でアクセスした場合、403エラーが発生する', () => {
    const user_id = 'user_employee_001';
    const user_role = 'salesrepresentative';
    const factor_id = 'factor_success_001';
    const approval_status = 'approved';

    expect(() =>
      evaluateSuccessFactorApproval({
        user_id,
        user_role,
        factor_id,
        approval_status,
      })
    ).toThrow(/営業管理職/);
  });
});