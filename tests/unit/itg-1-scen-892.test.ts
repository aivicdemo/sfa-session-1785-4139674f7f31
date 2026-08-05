import { describe, test, expect } from '@jest/globals';
import { analyzeTeamQualityStatistics } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-892
  test('チーム営業品質統計分析機能 - 営業担当者IDが空文字列のとき、エラーになる', () => {
    const teamId = 'TEAM-001';
    const salesPersonId = '';
    const aggregationStartDate = new Date('2024-01-01T00:00:00Z');
    const aggregationEndDate = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      analyzeTeamQualityStatistics({
        teamId,
        salesPersonId,
        aggregationStartDate,
        aggregationEndDate,
      })
    ).toThrow(/営業担当者ID/);
  });
});