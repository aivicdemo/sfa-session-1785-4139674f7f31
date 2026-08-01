import { recordCustomerResponse } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-312
  test('顧客接触完了の前提条件が満たされていない場合、顧客反応の記録がスキップされる', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    // 前提条件: 接触ステータスが「完了」ではない状態
    const incompleteContactRecord = {
      contactId: 'CTN-001',
      salesPersonId: 'SP-001',
      customerId: 'CUST-001',
      contactStatus: 'pending', // 「完了」ではなく「保留中」
      contactTimestamp: '2024-01-15T10:30:00Z',
    };

    const customerResponseData = {
      contactId: incompleteContactRecord.contactId,
      responseType: 'email_reply',
      comment: 'Thank you for your proposal',
      respondedAt: '2024-01-15T11:00:00Z',
    };

    // モック: 前提条件検証エンドポイント
    fetchMock.mockResponseOnce(
      JSON.stringify({
        statusCode: 422,
        message: '接触ステータスが完了していません',
        errorCode: 'CONTACT_NOT_COMPLETED',
      }),
      { status: 422 }
    );

    // 関数呼び出し
    const result = await recordCustomerResponse(
      customerResponseData.contactId,
      customerResponseData.responseType,
      customerResponseData.comment,
      customerResponseData.respondedAt
    );

    // 期待結果: HTTPステータスコード 422 が返される
    expect(result.statusCode).toBe(422);

    // 期待結果: エラーメッセージに「接触ステータスが完了していません」を含む
    expect(result.message).toMatch(/接触ステータス/);
    expect(result.message).toMatch(/完了/);

    // 期待結果: errorCode が正しく設定されている
    expect(result.errorCode).toBe('CONTACT_NOT_COMPLETED');

    // 期待結果: 顧客反応レコードが作成されていないことを確認
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        recordCount: 0,
      }),
      { status: 200 }
    );

    const verifyResult = await fetch(
      `/api/customer-responses?contactId=${customerResponseData.contactId}`
    );
    const verifyData = await verifyResult.json();
    expect(verifyData.recordCount).toBe(0);

    // 期待結果: 監査ログに記録されていることを確認
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        auditLogEntry: {
          event: 'CUSTOMER_RESPONSE_RECORD_SKIPPED',
          reason: '前提条件不満足',
          contactId: customerResponseData.contactId,
          timestamp: expect.any(String),
        },
      }),
      { status: 200 }
    );

    const auditResult = await fetch(
      `/api/audit-logs?eventType=CUSTOMER_RESPONSE_RECORD_SKIPPED&contactId=${customerResponseData.contactId}`
    );
    const auditData = await auditResult.json();
    expect(auditData.auditLogEntry.event).toBe('CUSTOMER_RESPONSE_RECORD_SKIPPED');
    expect(auditData.auditLogEntry.reason).toMatch(/前提条件/);
    expect(auditData.auditLogEntry.reason).toMatch(/不満足/);
  });
});