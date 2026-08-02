import { detectAndMergeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1081
  test('顧客マスタIDが未指定の重複候補があるとき、エラーが発生する', () => {
    const duplicateCandidates = [
      {
        duplicate_candidate_id: 'dc-001',
        primary_customer_id: 'cust-100',
        secondary_customer_id: 'cust-101',
        match_score: 0.95,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        duplicate_candidate_id: 'dc-002',
        primary_customer_id: null,
        secondary_customer_id: 'cust-103',
        match_score: 0.92,
        created_at: '2024-01-15T10:05:00Z',
      },
    ];

    expect(() =>
      detectAndMergeDuplicateCustomers({
        duplicate_candidates: duplicateCandidates,
      })
    ).toThrow(/顧客マスタID/);
  });
});