import { describe, test, expect } from '@jest/globals';
import { calculateTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  test('SCEN-898: 個別営業担当者の成約率がNaN（非数値）のとき、エラーになる', () => {
    const sales_representatives = [
      {
        rep_id: 'REP001',
        rep_name: '営業担当者A',
        contract_rate: NaN,
        total_proposals: 10,
        successful_contracts: 5,
      },
      {
        rep_id: 'REP002',
        rep_name: '営業担当者B',
        contract_rate: 0.6,
        total_proposals: 10,
        successful_contracts: 6,
      },
    ];

    expect(() =>
      calculateTeamQualityStatistics(sales_representatives)
    ).toThrow(/営業担当者A.*成約率が無効な値.*NaN/);
  });
});