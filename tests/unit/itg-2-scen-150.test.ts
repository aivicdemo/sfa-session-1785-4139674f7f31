import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-150
  test('定義された名寄せ基準ルール0件のとき、重複判定が実行されない', () => {
    const emptyRules: any[] = [];
    const customerData = [
      {
        customer_id: 'C001',
        customer_name: '太郎商事',
        postal_code: '100-0001',
        address: '東京都千代田区丸の内',
        phone: '03-1234-5678',
      },
      {
        customer_id: 'C002',
        customer_name: '太郎商事',
        postal_code: '100-0001',
        address: '東京都千代田区丸の内',
        phone: '03-1234-5678',
      },
    ];

    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    const result = detectDuplicateCustomers({
      customers: customerData,
      naming_rules: emptyRules,
    });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/名寄せ基準ルール.*0件.*重複判定処理.*スキップ/)
    );
    expect(result).toEqual([]);
    expect(result.length).toBe(0);

    mockConsoleLog.mockRestore();
  });
});