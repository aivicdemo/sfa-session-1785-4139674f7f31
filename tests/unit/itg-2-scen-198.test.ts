import { detectDuplicateAndInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定', () => {
  // SCEN-198
  test('顧客名が空のとき、重複判定が実行されない', () => {
    const customer_records = [
      {
        customer_id: 'C001',
        customer_name: '',
        phone_number: '09012345678',
        email: 'test@example.com',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'C001',
        customer_name: '田中太郎',
        phone_number: '09012345678',
        email: 'tanaka@example.com',
        address: '東京都渋谷区',
      },
    ];

    const execution_log: Array<{
      level: string;
      message: string;
      timestamp: string;
    }> = [];

    const result = detectDuplicateAndInconsistency(
      customer_records,
      execution_log
    );

    expect(result).toEqual([]);
    expect(execution_log).toContainEqual(
      expect.objectContaining({
        level: 'error',
        message: expect.stringMatching(/顧客名が空のため重複判定をスキップしました/),
      })
    );
  });
});