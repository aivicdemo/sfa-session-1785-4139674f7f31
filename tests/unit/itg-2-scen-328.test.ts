import { calculateCorrelationCoefficient } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-328: [edge] 営業データ品質検証エンジン - 成約実績が0件の営業担当者について相関係数が計算される
  test('成約実績が0件の営業担当者の相関係数を計算すると0.0またはNaNが返される', () => {
    const salesPersonData = {
      salesPersonId: 'SP-001',
      initialContactCount: 5,
      proposalCount: 3,
      lossCount: 2,
      closedDealCount: 0,
    };

    const result = calculateCorrelationCoefficient(salesPersonData);

    expect(
      result === 0.0 || Number.isNaN(result) || result === null
    ).toBe(true);
  });
});