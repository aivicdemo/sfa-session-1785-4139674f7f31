import { calculateMonthlyCorrelationCoefficient } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2822
  test('同一月内に集中した成約日と失敗日から月別相関係数が正確に計算される', () => {
    // テストデータ：2026年1月に集中した成約日と失敗日
    const successDates = [
      new Date('2026-01-05'),
      new Date('2026-01-08'),
      new Date('2026-01-12'),
      new Date('2026-01-18'),
      new Date('2026-01-25'),
    ];

    const failureDates = [
      new Date('2026-01-10'),
      new Date('2026-01-15'),
      new Date('2026-01-28'),
    ];

    // 月別相関係数を計算
    const correlationCoefficient = calculateMonthlyCorrelationCoefficient(
      successDates,
      failureDates
    );

    // 期待値：-0.2847（小数点第4位まで一致）
    expect(correlationCoefficient).toBeCloseTo(-0.2847, 4);
  });
});