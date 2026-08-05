import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-194: [error] 営業プロセス標準書の要件仕様変換機能 - 営業部長の承認コメントが空文字列のとき、承認コメント不正エラーが発生する
  test('should throw ERR_APPROVAL_COMMENT_EMPTY when approval_comment is empty string', () => {
    const input = {
      process_standard_id: 'PS-20240115-001',
      process_name: '初回接触プロセス',
      process_stage: 'stage_1_initial_contact',
      approval_comment: '',
      conversion_target_system: 'sales_audit_system',
      created_by_user_id: 'manager_001',
    };

    expect(() => convertProcessStandardToSystemRequirement(input)).toThrow(/承認コメント/);
  });
});