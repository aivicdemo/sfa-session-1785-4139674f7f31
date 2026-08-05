import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('顧客反応記録・標準化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-436
  test('フォローアップ未実行状態で顧客反応記録を試みたとき、ERR_FOLLOWUP_NOT_EXECUTEDエラーが発生し監査ログに記録される', async () => {
    const customerId = 'CUST-001';
    const employeeId = 'EMP-002';
    const recordedAt = '2024-01-15T10:30:00Z';
    const reactionType = '関心あり';

    // 顧客マスタ照会: フォローアップ未実行状態
    fetchMock.mockResponseOnce(
      JSON.stringify({
        customer_id: customerId,
        employee_id: employeeId,
        followup_executed_flag: false,
        followup_executed_at: null,
      }),
      { status: 200 }
    );

    // 顧客反応記録API呼び出し
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'error',
        error_code: 'ERR_FOLLOWUP_NOT_EXECUTED',
        message: 'フォローアップが未実行のため、顧客反応を記録できません',
      }),
      { status: 400 }
    );

    // 監査ログAPI呼び出し
    fetchMock.mockResponseOnce(
      JSON.stringify({
        audit_log_id: 'AUDIT-20240115-001',
        recorded_at: '2024-01-15T10:30:05Z',
      }),
      { status: 201 }
    );

    const payload = {
      customer_id: customerId,
      reaction_type: reactionType,
      recorded_at: recordedAt,
    };

    try {
      await recordCustomerReaction(payload);
      fail('Expected function to throw an error');
    } catch (error: any) {
      expect(error).toMatch(/フォローアップ/);
    }

    // レスポンス検証
    const recordCallArgs = fetchMock.mock.calls[1];
    const recordResponse = await fetch(
      recordCallArgs[0],
      recordCallArgs[1]
    ).then((res: Response) => res.json());

    expect(recordResponse.error_code).toBe('ERR_FOLLOWUP_NOT_EXECUTED');
    expect(recordResponse.message).toBe(
      'フォローアップが未実行のため、顧客反応を記録できません'
    );

    // 監査ログ検証
    const auditCallArgs = fetchMock.mock.calls[2];
    const auditPayload = JSON.parse(auditCallArgs[1].body);
    expect(auditPayload.customer_id).toBe(customerId);
    expect(auditPayload.message).toMatch(/CUST-001/);
    expect(auditPayload.message).toMatch(/フォローアップ未実行/);
  });
});