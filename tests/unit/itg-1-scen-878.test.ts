import { analyzeTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-878
  test('営業担当者ごとの成約率データが空のとき、エラーになる', () => {
    const empty_conversion_rate_data: { salesPersonId: string; conversionRate: number }[] = [];

    const result = analyzeTeamQualityStatistics({
      conversionRateByPerson: empty_conversion_rate_data,
      proposalAccuracyByPerson: [
        { salesPersonId: 'SP001', proposalAccuracy: 0.85 },
        { salesPersonId: 'SP002', proposalAccuracy: 0.78 },
      ],
      followUpSuccessRateByPerson: [
        { salesPersonId: 'SP001', followUpSuccessRate: 0.72 },
        { salesPersonId: 'SP002', followUpSuccessRate: 0.68 },
      ],
    });

    expect(result).toHaveProperty('errorCode', 'DATA_EMPTY_CONVERSION_RATE');
    expect(result.errorMessage).toMatch(/営業担当者ごとの成約率データが取得できません/);
  });
});