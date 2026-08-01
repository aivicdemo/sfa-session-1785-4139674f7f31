import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-141
  test('商談記録が1件のとき、標準プロセス遵守度スコアが正常に計算される', () => {
    const sales_person_id = 'sales_001';
    const completed_process_items_count = 3;
    const total_standard_process_items = 4;
    const expected_compliance_score = 75.0;

    const deal_records = [
      {
        deal_id: 'deal_001',
        sales_person_id: sales_person_id,
        status: '完了',
        process_steps_completed: [
          '初期接触',
          '提案資料送付',
          'クロージング'
        ]
      }
    ];

    const standard_process_definition = {
      total_items: total_standard_process_items,
      required_steps: [
        '初期接触',
        '提案資料送付',
        'クロージング',
        '顧客フォローアップ'
      ]
    };

    const report = generateSalesPersonBehaviorAnalysisReport({
      sales_person_id: sales_person_id,
      deal_records: deal_records,
      standard_process_definition: standard_process_definition
    });

    expect(report.standard_process_compliance_score).toBe(expected_compliance_score);
  });
});