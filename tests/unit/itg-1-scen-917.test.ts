import { describe, test, expect } from '@jest/globals';
import { calculateTeamWinRateWithRounding } from '../../src/logic/it-1-br-2-1-1';

describe('IT-1-BR-2-1-1: チーム営業品質月次分析機能 - 成約率計算と丸め処理', () => {
  // SCEN-917: [edge] チーム営業品質月次分析機能 - 成約率計算で割算により端数が発生するときの丸め処理が正しく適用される
  test('成約率計算で端数が発生するとき小数点第2位で四捨五入される', () => {
    const dealCount = 3;
    const winCount = 1;

    const result = calculateTeamWinRateWithRounding(dealCount, winCount);

    expect(result).toBe(33.33);
  });
});