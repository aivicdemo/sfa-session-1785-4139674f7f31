import { calculateContractRateReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-477: 成約率の計算値が小数点以下の端数を含む場合、正しく計算される', () => {
    const contracted_count = 3;
    const total_negotiation_count = 7;
    
    const result = calculateContractRateReport({
      contracted_count,
      total_negotiation_count,
    });
    
    const expected_contract_rate = (contracted_count / total_negotiation_count) * 100;
    const rounded_contract_rate = Math.round(expected_contract_rate * 100) / 100;
    
    expect(result.contract_rate).toBe(expected_contract_rate);
    expect(result.contract_rate_rounded).toBe(rounded_contract_rate);
    expect(result.contract_rate_rounded).toBe(42.86);
  });
});