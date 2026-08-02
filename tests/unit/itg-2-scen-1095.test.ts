import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1095
  test('複数の重複候補が同じ判定スコアで並ぶとき、スコアが同一の状態で記録される', () => {
    const testCustomer = {
      id: 'C999',
      name: '山田太郎',
      address: '東京都渋谷区',
    };

    const masterCustomers = [
      {
        id: 'C001',
        name: '山田太郎',
        address: '東京都渋谷区',
      },
      {
        id: 'C002',
        name: '山田 太郎',
        address: '東京都 渋谷区',
      },
      {
        id: 'C003',
        name: '太郎山田',
        address: '渋谷区東京都',
      },
    ];

    const result = detectDuplicateCustomers(testCustomer, masterCustomers);

    expect(result.duplicateCandidates).toHaveLength(3);

    expect(result.duplicateCandidates[0]).toEqual({
      id: 'C001',
      score: 0.92,
    });

    expect(result.duplicateCandidates[1]).toEqual({
      id: 'C002',
      score: 0.92,
    });

    expect(result.duplicateCandidates[2]).toEqual({
      id: 'C003',
      score: 0.85,
    });

    expect(result.duplicateCandidates[0].score).toBe(result.duplicateCandidates[1].score);
    expect(result.duplicateCandidates[0].score).toBeGreaterThan(result.duplicateCandidates[2].score);
  });
});