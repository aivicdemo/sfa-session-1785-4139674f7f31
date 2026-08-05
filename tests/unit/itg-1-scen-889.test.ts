import { describe, test, expect } from '@jest/globals';
import { analyzeTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  test('SCEN-889: 分析対象期間の開始日がnullのときValidationErrorをスロー', () => {
    const teamId = 'TEAM-001';
    const startDate = null;
    const endDate = new Date('2024-12-31');
    const analysisItems = ['成約率', '提案精度', 'フォローアップ成功率'];

    expect(() => {
      analyzeTeamQualityStatistics({
        teamId,
        startDate,
        endDate,
        analysisItems,
      });
    }).toThrow(/分析対象期間の開始日が未指定です/);
  });
});