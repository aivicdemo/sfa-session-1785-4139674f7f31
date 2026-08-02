import { determinePriorityForImprovementGuidance } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-314
  test('[normal] 改善指導優先順位の決定 - 複数営業担当者の優先度が1件のとき、唯一の営業担当者に優先度1が付与される', () => {
    const sales_staff_a = {
      sales_staff_id: 'A001',
      sales_staff_name: '営業担当者A',
      improvement_guidance_priority: 1,
      process_compliance_score: 65,
      deal_deviation_rate: 0.35,
      contract_achievement_rate: 0.75
    };

    const sales_staff_b = {
      sales_staff_id: 'B001',
      sales_staff_name: '営業担当者B',
      improvement_guidance_priority: 2,
      process_compliance_score: 80,
      deal_deviation_rate: 0.15,
      contract_achievement_rate: 0.85
    };

    const sales_staff_c = {
      sales_staff_id: 'C001',
      sales_staff_name: '営業担当者C',
      improvement_guidance_priority: 3,
      process_compliance_score: 75,
      deal_deviation_rate: 0.20,
      contract_achievement_rate: 0.80
    };

    const input_sales_staff_list = [sales_staff_a, sales_staff_b, sales_staff_c];

    const result = determinePriorityForImprovementGuidance(input_sales_staff_list);

    expect(result).toEqual({
      priority_1_staff: [
        {
          sales_staff_id: 'A001',
          sales_staff_name: '営業担当者A',
          improvement_guidance_priority: 1,
          process_compliance_score: 65,
          deal_deviation_rate: 0.35,
          contract_achievement_rate: 0.75
        }
      ],
      priority_2_or_higher_staff: [
        {
          sales_staff_id: 'B001',
          sales_staff_name: '営業担当者B',
          improvement_guidance_priority: 2,
          process_compliance_score: 80,
          deal_deviation_rate: 0.15,
          contract_achievement_rate: 0.85
        },
        {
          sales_staff_id: 'C001',
          sales_staff_name: '営業担当者C',
          improvement_guidance_priority: 3,
          process_compliance_score: 75,
          deal_deviation_rate: 0.20,
          contract_achievement_rate: 0.80
        }
      ]
    });

    expect(result.priority_1_staff.length).toBe(1);
    expect(result.priority_1_staff[0].sales_staff_id).toBe('A001');
    expect(result.priority_2_or_higher_staff.length).toBe(2);
    expect(result.priority_2_or_higher_staff.some(s => s.sales_staff_id === 'A001')).toBe(false);
  });
});