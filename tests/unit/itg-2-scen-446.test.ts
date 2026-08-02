import { detectDuplicateCustomer } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-446: 正規化ルール適用後に住所が完全に一致する場合、重複と判定される', () => {
    // Arrange
    const customerDataA = {
      customer_id: 'CUST001',
      customer_name: 'テスト商社A',
      address: '東京都 渋谷区 道玄坂 1-2-3',
    };

    const customerDataB = {
      customer_id: 'CUST002',
      customer_name: 'テスト商社B',
      address: '東京都渋谷区道玄坂1丁目2番3号',
    };

    const normalizationRules = [
      {
        rule_id: 'RULE001',
        rule_type: 'space_removal',
        description: 'スペース除去',
      },
      {
        rule_id: 'RULE002',
        rule_type: 'address_standardization',
        description: '丁目・番号表記の統一',
      },
    ];

    // Act
    const result = detectDuplicateCustomer(
      customerDataA,
      customerDataB,
      normalizationRules,
    );

    // Assert
    expect(result.isDuplicate).toBe(true);
    expect(result.reason).toBe('正規化後の住所が完全一致');
    expect(result.matchLevel).toBe('EXACT_MATCH');
  });
});