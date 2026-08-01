import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-318
  test('成約実績が複数件の営業担当者について成約率が正常に計算される', () => {
    const sales_person_id = 'SP-001';
    const contracted_count = 5;
    const lost_count = 15;
    const total_contact_count = 20;
    const expected_win_rate = 25.0;

    const result = generateSalesPersonAnalysisReport({
      sales_person_id,
      contracted_count,
      lost_count,
      total_contact_count,
    });

    expect(result).toEqual({
      sales_person_id: 'SP-001',
      contracted_count: 5,
      lost_count: 15,
      total_contact_count: 20,
      win_rate: 25.0,
    });
    expect(result.win_rate).toBe(expected_win_rate);
  });
});