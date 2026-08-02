import { detectDuplicateCustomersWithScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-803
  test('住所が完全一致する重複候補の重複度スコアが加算される', () => {
    const recordA = {
      customerId: 'C001',
      address: '東京都渋谷区道玄坂1-2-3',
      name: '山田太郎',
      phone: '090-1111-1111',
    };

    const recordB = {
      customerId: 'C002',
      address: '東京都渋谷区道玄坂1-2-3',
      name: '山田花子',
      phone: '090-2222-2222',
    };

    const result = detectDuplicateCustomersWithScore(recordA, recordB);

    expect(result.duplicateScore).toBeGreaterThanOrEqual(65);
    expect(result.baseScore).toBe(50);
    expect(result.addressMatchBonus).toBe(15);
    expect(result.totalScore).toBe(65);
    expect(result.isDuplicate).toBe(true);
  });
});