import { runTx11Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-1305: 営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント - 同じ要求を再実行しても重複させない', async () => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const case_id_001 = 'CASE-001';
    const customer_name_a = 'A社';
    const deal_amount_500m = 5000000;
    const success_factor_customized = '提案資料のカスタマイズ';

    const test_case_data_1st = {
      case_id: case_id_001,
      customer_name: customer_name_a,
      deal_amount: deal_amount_500m,
      success_factor: success_factor_customized,
      timestamp: '2024-01-15T10:00:00Z',
    };

    const knowledge_base_write_tracker: Array<{
      case_id: string;
      timestamp: string;
    }> = [];
    const notification_log_tracker: Array<{
      case_id: string;
      notification_timestamp: string;
    }> = [];

    const mock_ai_client = {
      analyzeCase: jest.fn().mockResolvedValue({
        case_id: case_id_001,
        classification: 'success',
        factors_extracted: [success_factor_customized],
        confidence_score: 0.95,
      }),
    };

    const mock_knowledge_base = {
      write: jest.fn(async (data: { case_id: string; timestamp: string }) => {
        knowledge_base_write_tracker.push(data);
        return { written: true, transaction_id: `TXN-${Date.now()}` };
      }),
      checkDuplicate: jest.fn(async (case_id: string) => {
        const existing = knowledge_base_write_tracker.filter(
          (item) => item.case_id === case_id
        );
        return { is_duplicate: existing.length > 0, count: existing.length };
      }),
    };

    const mock_notification_service = {
      send: jest.fn(async (message: {
        case_id: string;
        notification_timestamp: string;
      }) => {
        notification_log_tracker.push(message);
        return { sent: true, notification_id: `NOTIF-${Date.now()}` };
      }),
      checkDuplicateNotification: jest.fn(async (case_id: string) => {
        const existing_notifications = notification_log_tracker.filter(
          (item) => item.case_id === case_id
        );
        return {
          has_duplicate: existing_notifications.length > 1,
          count: existing_notifications.length,
        };
      }),
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        transaction_id: 'TXN-001-001',
        status: 'completed',
        cases_processed: 1,
      }),
      { status: 200 }
    );

    const result_1st = await runTx11Imp1Agent(
      test_case_data_1st,
      mock_ai_client,
      mock_knowledge_base,
      mock_notification_service
    );

    const transaction_id_1st = result_1st.transaction_id;

    expect(transaction_id_1st).toBeDefined();
    expect(typeof transaction_id_1st).toBe('string');
    expect(knowledge_base_write_tracker).toHaveLength(1);
    expect(knowledge_base_write_tracker[0].case_id).toBe(case_id_001);
    expect(notification_log_tracker).toHaveLength(1);
    expect(notification_log_tracker[0].case_id).toBe(case_id_001);

    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(
      JSON.stringify({
        transaction_id: 'TXN-002-001',
        status: 'completed',
        cases_processed: 1,
      }),
      { status: 200 }
    );

    const result_2nd = await runTx11Imp1Agent(
      test_case_data_1st,
      mock_ai_client,
      mock_knowledge_base,
      mock_notification_service
    );

    const transaction_id_2nd = result_2nd.transaction_id;

    expect(transaction_id_2nd).toBeDefined();
    expect(transaction_id_2nd).not.toBe(transaction_id_1st);

    expect(knowledge_base_write_tracker).toHaveLength(2);
    expect(knowledge_base_write_tracker[1].case_id).toBe(case_id_001);

    expect(notification_log_tracker).toHaveLength(2);
    expect(notification_log_tracker[1].case_id).toBe(case_id_001);

    const case_001_records = knowledge_base_write_tracker.filter(
      (item) => item.case_id === case_id_001
    );
    expect(case_001_records).toHaveLength(2);

    const case_001_notifications = notification_log_tracker.filter(
      (item) => item.case_id === case_id_001
    );
    expect(case_001_notifications).toHaveLength(2);

    const notification_contents_are_different =
      case_001_notifications[0].notification_timestamp !==
      case_001_notifications[1].notification_timestamp;
    expect(notification_contents_are_different).toBe(true);

    expect(mock_ai_client.analyzeCase).toHaveBeenCalledTimes(2);
    expect(mock_knowledge_base.write).toHaveBeenCalledTimes(2);
    expect(mock_notification_service.send).toHaveBeenCalledTimes(2);

    fetchMock.disableMocks();
  });
});