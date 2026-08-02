import { describe, test, expect } from '@jest/globals';
import { validateAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-518
  test('重複スコアが負数のとき、エラーが発生する', () => {
    const invalid_duplicate_score_negative = -0.5;
    
    expect(() => {
      validateAndMergeCustomerDuplicates({
        customer_id: 'CUST001',
        duplicate_score: invalid_duplicate_score_negative,
        merge_target_id: 'CUST002',
        normalization_rule_id: 'RULE_001'
      });
    }).toThrow(/重複スコア/);
  });
});