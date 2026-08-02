import { normalizeCustomerRecord } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-142
  test('正規化ルール0件のとき、レコードは正規化されない', () => {
    const inputRecord = {
      name: '山田太郎',
      address: '東京都渋谷区1-1',
      phone: '090-1234-5678',
    };

    const normalizationRules: any[] = [];

    const result = normalizeCustomerRecord(inputRecord, normalizationRules);

    expect(result.name).toBe('山田太郎');
    expect(result.address).toBe('東京都渋谷区1-1');
    expect(result.phone).toBe('090-1234-5678');
  });
});