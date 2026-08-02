import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-141
  test('住所が空文字列のレコードは検査対象外に除外される', () => {
    const input_records = [
      {
        customer_id: 'C001',
        name: '山田太郎',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'C002',
        name: '山田太郎',
        address: '',
      },
      {
        customer_id: 'C003',
        name: '山田太郎',
        address: '東京都渋谷区',
      },
    ];

    const result = detectDuplicateCustomersAndJudgeIntegration(input_records);

    expect(result.target_records).toHaveLength(2);
    expect(result.target_records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ customer_id: 'C001' }),
        expect.objectContaining({ customer_id: 'C003' }),
      ])
    );
    expect(result.excluded_records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ customer_id: 'C002' }),
      ])
    );
  });
});