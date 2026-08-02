import { describe, test, expect } from '@jest/globals';
import { detectDuplicateCustomerAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

// SCEN-1084
describe('顧客データ重複判定・統合エンジン', () => {
  test('正規化ルールが適用されていないとき、エラーが発生する', () => {
    const customerData = {
      name: '田中太郎',
      phoneNumber: '090-1234-5678',
    };

    const normalizationRule = null;

    expect(() => {
      detectDuplicateCustomerAndMerge(customerData, normalizationRule);
    }).toThrow(/ERR_NORMALIZATION_RULE_NOT_CONFIGURED/);
  });
});