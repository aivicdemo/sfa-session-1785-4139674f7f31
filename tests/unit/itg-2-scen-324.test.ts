import { calculateProcessDeviationForSalesRep } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-324
  test('顧客接触頻度データが欠けている場合、その営業担当者の乖離度計算がスキップされる', () => {
    const mockCalculateDeviation = jest.fn();
    const originalCalculate = calculateProcessDeviationForSalesRep;

    const salesRepWithMissingContactFrequency = {
      rep_id: 'REP-001',
      rep_name: 'Sales Rep A',
      customer_contact_frequency: null,
      proposal_count: 5,
      negotiation_count: 3,
      closure_count: 1,
    };

    jest.spyOn(global, 'console' as any).mockImplementation(() => {});

    const result = calculateProcessDeviationForSalesRep(
      salesRepWithMissingContactFrequency,
      mockCalculateDeviation
    );

    expect(mockCalculateDeviation).not.toHaveBeenCalled();
    expect(result).toEqual({
      rep_id: 'REP-001',
      deviation_score: null,
      calculation_skipped: true,
      reason: 'customer_contact_frequency_missing',
    });
  });
});