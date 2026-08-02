import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateRuleApprovalAccess } from '../../src/logic/it-1-br-2-2-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-568: [error] 修正ルール承認判定機能 - 承認権限を持たないユーザーが修正ルール案を確認しようとすると権限エラーが返される
  test('一般ユーザーが修正ルール案の詳細確認をリクエストした場合、403 Forbiddenエラーが返される', async () => {
    fetchMock.resetMocks();

    const user_id = 'USR-GEN-001';
    const user_role = 'general_user';
    const rule_id = 'RULE-2024-001';

    const error_response_body = {
      error_code: 'ERR_RULE_APPROVAL_UNAUTHORIZED',
      error_message:
        'この操作を実行する権限がありません。修正ルール承認には承認権限（管理者または承認者ロール）が必要です',
      http_status: 403,
    };

    fetchMock.mockResponseOnce(JSON.stringify(error_response_body), {
      status: 403,
    });

    try {
      await validateRuleApprovalAccess({
        user_id,
        user_role,
        rule_id,
      });
      expect(true).toBe(false);
    } catch (error_thrown) {
      const error_object = error_thrown as any;
      expect(error_object.http_status).toBe(403);
      expect(error_object.error_code).toBe('ERR_RULE_APPROVAL_UNAUTHORIZED');
      expect(error_object.error_message).toMatch(/権限/);
    }
  });
});