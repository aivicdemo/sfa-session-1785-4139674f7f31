import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { checkAuditDashboardAccess } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-492
  test('ログインユーザーの権限がない場合、エラーを返す', () => {
    const user_id = 'user_001_no_permission';
    const permission_level = 'view_forbidden';
    const dashboard_resource_id = 'audit_dashboard_main';

    expect(() => {
      checkAuditDashboardAccess({
        user_id,
        permission_level,
        dashboard_resource_id,
      });
    }).toThrow(/権限/);
  });
});