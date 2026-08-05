import { calculateMonthlyQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('月次営業品質統計分析機能', () => {
  // SCEN-876
  test('同じ入力で2回実行しても同じ統計結果が得られる', () => {
    const analysisParams = {
      analysisMonthYear: '2024-01',
      salesPersonId: 'EMP001',
      dealStatus: 'completed',
      minimumContractAmount: 1000000,
    };

    const resultFirst = calculateMonthlyQualityStatistics(analysisParams);

    const resultSecond = calculateMonthlyQualityStatistics(analysisParams);

    expect(resultFirst.contractCount).toBe(15);
    expect(resultSecond.contractCount).toBe(15);

    expect(resultFirst.totalContractAmount).toBe(45000000);
    expect(resultSecond.totalContractAmount).toBe(45000000);

    expect(resultFirst.averageUnitPrice).toBe(3000000);
    expect(resultSecond.averageUnitPrice).toBe(3000000);

    expect(resultFirst.contractRate).toBe(62.5);
    expect(resultSecond.contractRate).toBe(62.5);

    expect(resultFirst.salesActivityDays).toBe(21);
    expect(resultSecond.salesActivityDays).toBe(21);

    expect(resultFirst).toEqual(resultSecond);
  });
});