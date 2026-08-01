import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-160
  test('改善指導優先度スコアが同一の複数営業担当者のとき、乖離パターンの複雑さで順位付けされる', () => {
    const salesPersons = [
      {
        sales_person_id: 'SP001',
        sales_person_name: '営業担当者A',
        improvement_priority_score: 75,
        deviation_pattern_type: 'single',
        deviation_pattern_complexity: 1,
      },
      {
        sales_person_id: 'SP002',
        sales_person_name: '営業担当者B',
        improvement_priority_score: 75,
        deviation_pattern_type: 'composite',
        deviation_pattern_complexity: 3,
      },
      {
        sales_person_id: 'SP003',
        sales_person_name: '営業担当者C',
        improvement_priority_score: 75,
        deviation_pattern_type: 'chain',
        deviation_pattern_complexity: 2,
      },
    ];

    const report = generateSalesPersonAnalysisReport(salesPersons);

    expect(report.improvement_priority_list).toEqual([
      {
        rank: 1,
        sales_person_id: 'SP002',
        sales_person_name: '営業担当者B',
        improvement_priority_score: 75,
        deviation_pattern_type: 'composite',
        deviation_pattern_complexity: 3,
      },
      {
        rank: 2,
        sales_person_id: 'SP003',
        sales_person_name: '営業担当者C',
        improvement_priority_score: 75,
        deviation_pattern_type: 'chain',
        deviation_pattern_complexity: 2,
      },
      {
        rank: 3,
        sales_person_id: 'SP001',
        sales_person_name: '営業担当者A',
        improvement_priority_score: 75,
        deviation_pattern_type: 'single',
        deviation_pattern_complexity: 1,
      },
    ]);
  });
});