import { judgeCoachingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-198
  test('複数の営業担当者が同じ乖離度である場合、全員が同じ判定結果を受ける', () => {
    const salesRepA = {
      sales_rep_id: 'SR001',
      sales_rep_name: '営業担当者A',
      deviation_rate: 75.0,
    };

    const salesRepB = {
      sales_rep_id: 'SR002',
      sales_rep_name: '営業担当者B',
      deviation_rate: 75.0,
    };

    const salesRepC = {
      sales_rep_id: 'SR003',
      sales_rep_name: '営業担当者C',
      deviation_rate: 75.0,
    };

    const resultA = judgeCoachingTarget(salesRepA);
    const resultB = judgeCoachingTarget(salesRepB);
    const resultC = judgeCoachingTarget(salesRepC);

    expect(resultA.coaching_target_category).toBe('要指導');
    expect(resultA.coaching_priority).toBe('高');

    expect(resultB.coaching_target_category).toBe('要指導');
    expect(resultB.coaching_priority).toBe('高');

    expect(resultC.coaching_target_category).toBe('要指導');
    expect(resultC.coaching_priority).toBe('高');

    expect(resultA.coaching_target_category).toEqual(resultB.coaching_target_category);
    expect(resultB.coaching_target_category).toEqual(resultC.coaching_target_category);

    expect(resultA.coaching_priority).toEqual(resultB.coaching_priority);
    expect(resultB.coaching_priority).toEqual(resultC.coaching_priority);
  });
});