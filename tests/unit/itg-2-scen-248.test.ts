import { describe, test, expect } from '@jest/globals';
import { detectDuplicateAndNormalize } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-248
  test('正規化ルールの変換ロジックが欠けているとき、正規化処理がエラーになる', () => {
    const normalizationRule = {
      ruleId: 'rule-001',
      ruleName: 'CustomerNameNormalization',
      targetField: 'customerName',
      // transformationLogic は意図的に削除
    };

    const customerData = {
      customerId: 'CUST-12345',
      customerName: '  株式会社  テスト  会社  ',
      customerCode: 'TST001',
    };

    expect(() =>
      detectDuplicateAndNormalize(customerData, normalizationRule)
    ).toThrow(/transformationLogic/);
  });
});