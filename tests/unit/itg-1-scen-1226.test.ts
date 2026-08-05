import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1226
  test('[normal] データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 定義されたクリーニングルールに従いデータを正規化する', async () => {
    // テスト用営業プロセスログデータセット（100件、複数の顧客重複あり）
    const raw_process_logs = Array.from({ length: 100 }, (_, idx) => ({
      id: `log_${idx + 1}`,
      customer_id: `cust_${Math.floor((idx + 1) / 10) + 1}`,
      customer_name: idx % 2 === 0 ? `顧客${Math.floor((idx + 1) / 10) + 1}` : `ｺﾃﾞﾝ${Math.floor((idx + 1) / 10) + 1}`,
      phone: idx % 3 === 0 ? `090-1234-${String(5678 + idx).padStart(4, '0')}` : `09012345${String(678 + idx).padStart(3, '0')}`,
      address: idx % 5 === 0 ? `東京都　渋谷区　１丁目１番地` : `東京都渋谷区1-1`,
      date: idx % 4 === 0 ? `2024/01/15` : `2024-01-15`,
      activity_type: 'visit',
      timestamp: `2024-01-15T10:00:${String(idx).padStart(2, '0')}Z`,
    }));

    // クリーニングルール定義
    const cleaning_rules = {
      phone: {
        pattern: /[^\d]/g,
        format: (value: string) => {
          const digits = value.replace(/[^\d]/g, '');
          return digits.length === 10 ? `090${digits}` : digits.length === 11 ? digits : value;
        },
      },
      address: {
        rules: [
          { from: /[　\s]+/g, to: ' ' },
          { from: /([0-9０-９]+)(丁目|番地)/g, to: '$1' },
        ],
        normalize: (value: string) => {
          let result = value;
          result = result.replace(/[　\s]+/g, ' ').trim();
          result = result.replace(/([０-９]+)/g, (match: string) => {
            return String(parseInt(match.replace(/[０-９]/g, (char: string) => String('０'.charCodeAt(0) - char.charCodeAt(0))), 10));
          });
          return result;
        },
      },
      date: {
        format: 'YYYY-MM-DD',
        normalize: (value: string) => {
          const dateRegex = /(\d{4})[-/](\d{2})[-/](\d{2})/;
          const match = value.match(dateRegex);
          return match ? `${match[1]}-${match[2]}-${match[3]}` : value;
        },
      },
      customer_name: {
        normalize: (value: string) => {
          return value.replace(/[ｱ-ﾝﾞﾟ]/g, (char: string) => {
            const hankaku_code = char.charCodeAt(0);
            const zenkaku_map: { [key: number]: string } = {
              0xff61: 'ア', 0xff62: 'イ', 0xff63: 'ウ', 0xff64: 'エ', 0xff65: 'オ',
            };
            return zenkaku_map[hankaku_code] || char;
          });
        },
      },
    };

    // 正規化済みデータの期待値構造
    const expected_normalized_data = raw_process_logs.map((log) => {
      const normalized_phone = '0901234' + String(5678 + raw_process_logs.indexOf(log)).padStart(4, '0');
      const normalized_address = '東京都 渋谷区 1 1';
      const normalized_date = '2024-01-15';
      const normalized_name = log.customer_name.replace(/ｺﾃﾞﾝ/g, 'コデン');

      return {
        id: log.id,
        customer_id: log.customer_id,
        customer_name: normalized_name || log.customer_name,
        phone: normalized_phone,
        address: normalized_address,
        date: normalized_date,
        activity_type: log.activity_type,
        timestamp: log.timestamp,
        normalization_status: 'NORMALIZED',
        applied_rules: [
          log.phone !== normalized_phone ? 'phone_format' : null,
          log.address !== normalized_address ? 'address_normalize' : null,
          log.date !== normalized_date ? 'date_format' : null,
          log.customer_name !== normalized_name ? 'customer_name_zenkaku' : null,
        ].filter((r) => r !== null),
      };
    });

    // AIクライアントの入力・出力メッシュをモック
    const mock_ai_client = {
      normalizeDataByCleaning: jest.fn().mockResolvedValue({
        normalized_records: expected_normalized_data,
        normalization_log: expected_normalized_data.map((record, idx) => ({
          record_id: record.id,
          input_data: raw_process_logs[idx],
          applied_rules: record.applied_rules,
          output_data: record,
          timestamp: '2024-01-15T10:00:00Z',
        })),
        total_records_processed: 100,
        total_records_normalized: 100,
        processing_status: 'COMPLETED',
      }),
    };

    // runTx1Imp1Agent を呼び出し
    const agent_input = {
      extraction_period_start: '2024-01-01',
      extraction_period_end: '2024-01-31',
      quality_threshold: 0.95,
      cleaning_rules_definition: cleaning_rules,
      raw_data: raw_process_logs,
    };

    const agent_result = await runTx1Imp1Agent(agent_input, mock_ai_client);

    // アサーション：AIクライアントの呼び出し確認
    expect(mock_ai_client.normalizeDataByCleaning).toHaveBeenCalledWith(
      expect.objectContaining({
        raw_records: raw_process_logs,
        cleaning_rules: cleaning_rules,
      })
    );

    // アサーション：正規化済みデータの件数確認
    expect(agent_result.normalized_records).toHaveLength(100);

    // アサーション：電話番号フォーマット確認（スペース・ハイフン削除、『09012345678』形式）
    agent_result.normalized_records.forEach((record: any) => {
      expect(record.phone).toMatch(/^09\d{9}$/);
    });

    // アサーション：住所形式確認（『都道府県 市区町村 丁目番地』形式）
    agent_result.normalized_records.forEach((record: any) => {
      expect(record.address).toMatch(/^東京都 渋谷区 \d+ \d+$/);
    });

    // アサーション：日付形式確認（『YYYY-MM-DD』形式）
    agent_result.normalized_records.forEach((record: any) => {
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    // アサーション：顧客名の全角・半角統一確認
    agent_result.normalized_records.forEach((record: any) => {
      expect(record.customer_name).not.toMatch(/[ｱ-ﾝﾞﾟ]/);
    });

    // アサーション：正規化対象データ全件処理確認
    expect(agent_result.total_records_processed).toBe(100);
    expect(agent_result.total_records_normalized).toBe(100);

    // アサーション：処理ログ全件保存確認
    expect(agent_result.normalization_log).toHaveLength(100);
    agent_result.normalization_log.forEach((log_entry: any, idx: number) => {
      expect(log_entry).toMatchObject({
        record_id: `log_${idx + 1}`,
        input_data: expect.any(Object),
        applied_rules: expect.any(Array),
        output_data: expect.any(Object),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
      });
    });

    // アサーション：正規化状態『NORMALIZED』での次ステップ引き継ぎ確認
    agent_result.normalized_records.forEach((record: any) => {
      expect(record.normalization_status).toBe('NORMALIZED');
    });

    // アサーション：処理ステータス完了確認
    expect(agent_result.processing_status).toBe('COMPLETED');
  });
});