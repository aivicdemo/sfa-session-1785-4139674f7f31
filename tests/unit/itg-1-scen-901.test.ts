import { calculateDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能 - 乖離度計算', () => {
  // SCEN-901
  test('乖離度計算時に個別営業担当者の成約率がチーム平均を参照できないとき、エラーになる', () => {
    const salesperson = {
      id: 'SP001',
      name: '営業担当者A',
      contractRate: 0.4,
      totalDeals: 5,
      successfulDeals: 2,
    };

    const teamAverageRef = undefined;

    expect(() => {
      calculateDeviation(salesperson, teamAverageRef);
    }).toThrow(/チーム平均成約率/);
  });
});