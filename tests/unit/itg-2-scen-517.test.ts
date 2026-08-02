import { detectDuplicateAndDecideConsolidation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-517
  test('重複スコアが100のとき、統合対象として判定される', () => {
    const customerRecordA = {
      id: 1001,
      name: '株式会社テスト',
      email: 'test@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customerRecordB = {
      id: 1002,
      name: '株式会社テスト',
      email: 'test@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const duplicateScore = 100;

    const result = detectDuplicateAndDecideConsolidation(
      customerRecordA,
      customerRecordB,
      duplicateScore,
    );

    expect(result.isConsolidationTarget).toBe(true);
    expect(result.consolidationStatus).toBe('CONSOLIDATE_REQUIRED');
  });
});