import { classifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-549
  test('[error] 顧客データ重duplicate検出・分類機能 - 重複候補の顧客ID_1が欠けている入力のとき、分類エラーとして記録される', () => {
    const duplicateCandidateWithMissingId = {
      duplicate_candidate_id: 'DUP-001',
      customer_id_1: null,
      customer_id_2: 'CUST-0002',
      match_score: 0.95,
      match_reason: 'name_phone_match',
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() =>
      classifyDuplicateCustomers(duplicateCandidateWithMissingId)
    ).toThrow(/顧客ID_1/);
  });
});