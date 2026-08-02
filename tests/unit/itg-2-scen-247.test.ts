import { describe, test, expect } from '@jest/globals';
import { judgeCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-247
  test('重複候補の類似度が欠けているとき、統合判定がエラーになる', () => {
    const duplicate_candidate = {
      customerIdA: 'CUST-001',
      customerIdB: 'CUST-002',
      matchedFields: ['company_name', 'postal_code'],
      similarityScore: null,
    };

    expect(() => judgeCustomerMerge(duplicate_candidate)).toThrow(/MISSING_SIMILARITY_SCORE/);
  });
});