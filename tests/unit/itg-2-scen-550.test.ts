import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-550
  test('[error] 顧客データ重複検出・分類機能 - 重複候補の顧客ID_2が欠けている入力のとき、分類エラーとして記録される', () => {
    const duplicateCandidateWithMissingId = {
      customerId_1: 'CUST-001',
      customerId_2: null,
    };

    expect(() => detectAndClassifyDuplicateCustomers(duplicateCandidateWithMissingId)).toThrow(/顧客ID_2/);
  });
});