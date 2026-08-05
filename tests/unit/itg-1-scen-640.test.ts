import { analyzeActionPatternAndCompareWithSuccessPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-640
  test('顧客対応パターンと成功パターンの合致度が閾値直上（例：80.1%）のとき、合致として判定される', () => {
    const sales_rep_id = 'SR_001';
    const customer_contact_pattern_score = 80.1;
    const success_pattern_match_threshold = 80.0;
    const expected_match_status = 'matched';
    const expected_report_status = '成功パターン合致';

    const result = analyzeActionPatternAndCompareWithSuccessPattern({
      sales_rep_id,
      customer_contact_pattern_score,
      success_pattern_match_threshold,
    });

    expect(result.match_status).toBe(expected_match_status);
    expect(result.report_status).toBe(expected_report_status);
    expect(result.match_score).toBe(80.1);
  });
});