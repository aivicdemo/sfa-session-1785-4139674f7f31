import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-242
  test('[normal] 重複候補が複数件のとき、全ての重複候補に対して統合判定が実行される', () => {
    const existingCustomers = [
      {
        id: 'cust_a',
        name: '田中太郎',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
      },
      {
        id: 'cust_b',
        name: '田中太郎',
        phone: '090-1234-5678',
        email: 'tanaka.t@example.com',
      },
      {
        id: 'cust_c',
        name: '田中太郎',
        phone: '',
        email: 'tanaka@example.com',
      },
    ];

    const newCustomer = {
      name: '田中太郎',
      phone: '090-1234-5678',
      email: 'tanaka2@example.com',
    };

    const result = detectDuplicateCustomers(newCustomer, existingCustomers);

    expect(result.duplicateCandidates).toHaveLength(3);

    expect(result.duplicateCandidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customerId: 'cust_a',
          matchScore: 0.95,
        }),
        expect.objectContaining({
          customerId: 'cust_b',
          matchScore: 0.87,
        }),
        expect.objectContaining({
          customerId: 'cust_c',
          matchScore: 0.72,
        }),
      ])
    );

    expect(result.integrationJudgmentCount).toBe(3);

    result.duplicateCandidates.forEach((candidate) => {
      expect(candidate).toHaveProperty('customerId');
      expect(candidate).toHaveProperty('matchScore');
      expect(typeof candidate.matchScore).toBe('number');
      expect(candidate.matchScore).toBeGreaterThan(0);
      expect(candidate.matchScore).toBeLessThanOrEqual(1);
    });

    const scores = result.duplicateCandidates.map((c) => c.matchScore);
    const uniqueScores = new Set(scores);
    expect(uniqueScores.size).toBe(3);
  });
});