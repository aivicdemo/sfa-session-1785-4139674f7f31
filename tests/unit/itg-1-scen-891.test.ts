import { describe, it, expect } from '@jest/globals';
import { analyzeTeamSalesQualityStatistics } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  it('SCEN-891: チーム営業品質統計分析機能 - 営業担当者IDがnullまたは未定義のとき、エラーになる', () => {
    const invalid_sales_person_id = null;
    const analysis_period_start = '2024-01-01T00:00:00Z';
    const analysis_period_end = '2024-01-31T23:59:59Z';

    expect(() =>
      analyzeTeamSalesQualityStatistics({
        sales_person_id: invalid_sales_person_id,
        period_start: analysis_period_start,
        period_end: analysis_period_end,
      })
    ).toThrow(/営業担当者ID/);
  });
});