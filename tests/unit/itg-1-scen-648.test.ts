import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-648
  test('成約率が端数の場合、指定の丸め方法で処理される', () => {
    const salesPersonData = {
      sales_person_id: 'SP001',
      sales_person_name: '営業太郎',
      closed_deals_count: 3,
      proposal_count: 9,
      rounding_method: 'round',
      decimal_places: 2,
    };

    const result = generateBehaviorPatternAnalysisReport(salesPersonData);

    const expected_win_rate = 33.33;
    expect(result.win_rate).toBe(expected_win_rate);
  });
});