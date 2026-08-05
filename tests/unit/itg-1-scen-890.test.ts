import { analyzeTeamSalesQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  test('SCEN-890: 分析対象期間の終了日がnullまたは未定義のとき、エラーになる', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    
    // ケース1: 終了日がnull
    expect(() => 
      analyzeTeamSalesQualityStatistics({
        start_date,
        end_date: null as any
      })
    ).toThrow(/分析対象期間の終了日/);

    // ケース2: 終了日がundefined
    expect(() => 
      analyzeTeamSalesQualityStatistics({
        start_date,
        end_date: undefined as any
      })
    ).toThrow(/分析対象期間の終了日/);
  });
});