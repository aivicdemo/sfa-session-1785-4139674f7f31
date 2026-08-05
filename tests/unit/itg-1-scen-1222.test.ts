import { runTx1Imp1Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1222: [normal] データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 「データ抽出から品質検証・クリーニングまでの自動実行」が自律処理「指定期間の営業プロセスログを営業システムから抽出する」を契約どおり実行する
  test('should extract sales process logs from specified period with complete data and audit trail', async () => {
    // Setup: テスト用の営業システムスタブデータ（2024年1月1日〜1月31日の営業プロセスログ100件）
    const mock_logs = Array.from({ length: 100 }, (_, index) => ({
      log_id: `LOG-2024-01-${String(index + 1).padStart(5, '0')}`,
      customer_id: `CUST-${String(index + 1).padStart(5, '0')}`,
      deal_datetime: new Date(2024, 0, Math.floor(index / 3) + 1, Math.floor(Math.random() * 24), 0, 0).toISOString(),
      amount: (index + 1) * 50000,
      status: ['初回接触', '提案', '交渉', '成約'][index % 4],
      created_at: new Date(2024, 0, 1, 0, 0, 0).toISOString(),
      updated_at: new Date(2024, 0, 31, 23, 59, 59).toISOString(),
    }));

    // Mock実装: Tx1Imp1AiClientの偽装
    const fake_ai_client = {
      extractProcessLogs: jest.fn().mockResolvedValue({
        extracted_logs: mock_logs,
        extraction_start_time: '2024-01-01T00:00:00Z',
        extraction_end_time: '2024-01-31T23:59:59Z',
        total_records: 100,
        period_from: '2024-01-01',
        period_to: '2024-01-31',
      }),
      validateLogCompleteness: jest.fn().mockResolvedValue({
        is_valid: true,
        missing_fields: [],
        malformed_records: [],
      }),
      generateProcessLog: jest.fn().mockResolvedValue({
        log_entries: [
          {
            timestamp: '2024-01-01T09:00:00Z',
            action: '抽出開始',
            period: '2024-01-01〜2024-01-31',
          },
          {
            timestamp: '2024-01-01T09:15:00Z',
            action: '抽出完了',
            record_count: 100,
          },
        ],
      }),
      persistAuditLogs: jest.fn().mockResolvedValue({
        storage_path: 'logs/tx-1-imp-1/extraction-20240101-091500.jsonl',
        persisted_count: 100,
        persist_timestamp: '2024-01-01T09:15:00Z',
      }),
    };

    // Call: runTx1Imp1Agent関数に対して、抽出対象期間を「2024-01-01」〜「2024-01-31」として呼び出す
    const result = await runTx1Imp1Agent(
      {
        extraction_period_from: '2024-01-01',
        extraction_period_to: '2024-01-31',
        ai_client: fake_ai_client,
      }
    );

    // Assert: AIエージェントが営業システムスタブの抽出API（getProcessLogs）を呼び出し、指定期間のデータを取得することを確認する
    expect(fake_ai_client.extractProcessLogs).toHaveBeenCalledWith({
      period_from: '2024-01-01',
      period_to: '2024-01-31',
    });

    // Assert: 抽出されたデータが以下の条件を満たしていることを検証する：
    // - 期間内のログ100件がすべて含まれていること
    expect(result.extracted_data).toBeDefined();
    expect(result.extracted_data.total_records).toBe(100);

    // - 各ログが必須項目（顧客ID、商談日時、金額、ステータス）を持つこと
    result.extracted_data.logs.forEach((log) => {
      expect(log.customer_id).toBeDefined();
      expect(log.deal_datetime).toBeDefined();
      expect(log.amount).toBeDefined();
      expect(log.status).toBeDefined();
    });

    // - 日時形式がISO8601準拠であること
    result.extracted_data.logs.forEach((log) => {
      const iso8601_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
      expect(log.deal_datetime).toMatch(iso8601_regex);
    });

    // Assert: 処理ログに「抽出開始」「抽出完了」「件数：100」「期間：2024-01-01〜2024-01-31」を示すエントリが記録されていることを確認する
    expect(result.process_logs).toBeDefined();
    expect(result.process_logs.length).toBeGreaterThan(0);

    const extraction_start_log = result.process_logs.find((log) => log.action === '抽出開始');
    expect(extraction_start_log).toBeDefined();
    expect(extraction_start_log?.period).toContain('2024-01-01');
    expect(extraction_start_log?.period).toContain('2024-01-31');

    const extraction_end_log = result.process_logs.find((log) => log.action === '抽出完了');
    expect(extraction_end_log).toBeDefined();
    expect(extraction_end_log?.record_count).toBe(100);

    // Assert: テスト終了時、処理ログの全件が永続化ストレージ（例：logs/tx-1-imp-1/extraction-YYYYMMDD-HHMMSS.jsonl）に保存されていることを検証する
    expect(fake_ai_client.persistAuditLogs).toHaveBeenCalled();
    expect(result.audit_trail).toBeDefined();
    expect(result.audit_trail.storage_path).toMatch(/logs\/tx-1-imp-1\/extraction-\d{8}-\d{6}\.jsonl/);
    expect(result.audit_trail.persisted_count).toBe(100);

    // Assert: 期待結果の確認：抽出データに過不足がなく、すべてのレコードが必須項目を備えている
    expect(result.validation_result.is_valid).toBe(true);
    expect(result.validation_result.missing_fields).toEqual([]);
    expect(result.validation_result.malformed_records).toEqual([]);

    // Assert: 契約上の自律処理「指定期間の営業プロセスログを営業システムから抽出する」が完了し、次のステップへ進む準備が整った状態
    expect(result.status).toBe('extraction_completed');
    expect(result.next_step).toBe('data_completeness_validation');
  });
});