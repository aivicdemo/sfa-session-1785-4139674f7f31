import { describe, test, expect } from '@jest/globals';
import { calculateTeamFollowUpSuccessRate } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能 - フォローアップ成功率計算', () => {
  // SCEN-883: チーム平均フォローアップ成功率が計算できない（分母となるフォローアップ件数が0）とき、エラーになる
  test('フォローアップ実施件数が0件のときエラーが発生する', () => {
    const input_follow_up_count = 0;
    const input_follow_up_success_count = 5;

    expect(() => {
      calculateTeamFollowUpSuccessRate({
        follow_up_count: input_follow_up_count,
        follow_up_success_count: input_follow_up_success_count,
      });
    }).toThrow(/フォローアップ件数/);
  });
});