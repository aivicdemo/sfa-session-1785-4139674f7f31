import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateTeamAverageProposeAccuracy } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能 - 提案精度計算エラーハンドリング', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-882
  test('提案数が0件のとき、DIVISION_BY_ZEROエラーが返却される', () => {
    const team_proposal_results = [];

    const result = calculateTeamAverageProposeAccuracy(team_proposal_results);

    expect(result).toEqual({
      error: true,
      code: 'DIVISION_BY_ZERO',
      message: '提案数が0件のため平均提案精度を計算できません'
    });
  });
});