import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateWinRateWithRounding } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-582
  test('成約件数を1件、案件総数を3件として入力した場合、成約率が33.33%に丸められて返される', () => {
    const closed_deals = 1;
    const total_deals = 3;

    const result = calculateWinRateWithRounding({
      closed_deals,
      total_deals,
    });

    expect(result).toBe(33.33);
  });
});