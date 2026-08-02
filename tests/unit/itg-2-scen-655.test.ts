import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-655
  test('推奨内容根拠の可視化機能 - 複数の成功パターンがすべて正しく適用される', () => {
    const successPatterns = [
      {
        pattern_id: 'pattern_A',
        pattern_name: 'パターンA',
        conditions: {
          min_sales_amount: 1000000,
          customer_type: '大手'
        },
        success_rate: 85,
        case_count: 42
      },
      {
        pattern_id: 'pattern_B',
        pattern_name: 'パターンB',
        conditions: {
          min_sales_amount: 500000,
          min_sales_experience_years: 3
        },
        success_rate: 72,
        case_count: 28
      },
      {
        pattern_id: 'pattern_C',
        pattern_name: 'パターンC',
        conditions: {
          min_contract_rate: 80,
          min_proposal_count: 10
        },
        success_rate: 78,
        case_count: 35
      }
    ];

    const result = visualizeRecommendationBasis(successPatterns);

    expect(result.patterns_count).toBe(3);
    expect(result.visualized_patterns).toHaveLength(3);

    expect(result.visualized_patterns[0]).toEqual({
      pattern_id: 'pattern_A',
      pattern_name: 'パターンA',
      conditions: {
        min_sales_amount: 1000000,
        customer_type: '大手'
      },
      success_rate: 85,
      case_count: 42,
      is_applicable: true
    });

    expect(result.visualized_patterns[1]).toEqual({
      pattern_id: 'pattern_B',
      pattern_name: 'パターンB',
      conditions: {
        min_sales_amount: 500000,
        min_sales_experience_years: 3
      },
      success_rate: 72,
      case_count: 28,
      is_applicable: true
    });

    expect(result.visualized_patterns[2]).toEqual({
      pattern_id: 'pattern_C',
      pattern_name: 'パターンC',
      conditions: {
        min_contract_rate: 80,
        min_proposal_count: 10
      },
      success_rate: 78,
      case_count: 35,
      is_applicable: true
    });

    expect(result.all_conditions_applied).toBe(true);
    expect(result.basis_visualization_generated).toBe(true);
  });
});