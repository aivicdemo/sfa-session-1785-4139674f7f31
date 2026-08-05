import { calculateImprovementPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-467
  test('改善指導の優先順位が、標準プロセスからの乖離度が大きい営業担当者順に正常に算出される', () => {
    const salesReps = [
      {
        id: 'rep_A',
        name: 'A',
        deviationRate: 35,
      },
      {
        id: 'rep_B',
        name: 'B',
        deviationRate: 15,
      },
      {
        id: 'rep_C',
        name: 'C',
        deviationRate: 50,
      },
    ];

    const result = calculateImprovementPriority(salesReps);

    expect(result).toEqual([
      {
        id: 'rep_C',
        name: 'C',
        deviationRate: 50,
        priority: 1,
      },
      {
        id: 'rep_A',
        name: 'A',
        deviationRate: 35,
        priority: 2,
      },
      {
        id: 'rep_B',
        name: 'B',
        deviationRate: 15,
        priority: 3,
      },
    ]);
  });
});