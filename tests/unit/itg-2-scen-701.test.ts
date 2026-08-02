import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-701: [normal] 提案資料と顧客ニーズの適合度スコア化機能 - 提案資料の項目が複数件のとき、全項目に対するスコアが算出される', () => {
    const proposal_document = {
      proposal_id: 'PROP-20240115-001',
      customer_id: 'CUST-002',
      items: [
        {
          item_id: 'ITEM-A',
          item_name: '技術仕様書',
          item_type: 'technical_spec',
          content: 'サーバー構成、API仕様、セキュリティ要件',
          needs_mapping: {
            need_category: 'technical_requirement',
            need_value: 'infrastructure_modernization'
          }
        },
        {
          item_id: 'ITEM-B',
          item_name: '導入事例',
          item_type: 'case_study',
          content: '同業他社の導入実績、ROI、運用効果',
          needs_mapping: {
            need_category: 'business_case',
            need_value: 'implementation_reference'
          }
        },
        {
          item_id: 'ITEM-C',
          item_name: '価格表',
          item_type: 'pricing',
          content: 'ライセンス料金、導入コスト、保守費用',
          needs_mapping: {
            need_category: 'budget_constraint',
            need_value: 'cost_optimization'
          }
        }
      ],
      created_at: new Date('2024-01-15T11:00:00Z'),
      updated_at: new Date('2024-01-15T11:00:00Z')
    };

    const customer_needs_data = {
      customer_id: 'CUST-002',
      industry: 'manufacturing',
      company_size: 'large',
      primary_challenges: ['system_modernization', 'cost_reduction', 'operational_efficiency'],
      budget_limit: 5000000,
      implementation_timeline: '3_to_6_months',
      key_success_factors: ['technical_compatibility', 'proven_implementation_track_record', 'total_cost_of_ownership']
    };

    const item_scoring_map = {
      'technical_requirement_infrastructure_modernization': 0.92,
      'business_case_implementation_reference': 0.78,
      'budget_constraint_cost_optimization': 0.85
    };

    const score_result = calculateProposalNeedsAlignmentScore(
      proposal_document,
      customer_needs_data,
      item_scoring_map
    );

    expect(score_result).toEqual({
      proposal_id: 'PROP-20240115-001',
      customer_id: 'CUST-002',
      item_scores: [
        {
          item_id: 'ITEM-A',
          item_name: '技術仕様書',
          alignment_score: 0.92
        },
        {
          item_id: 'ITEM-B',
          item_name: '導入事例',
          alignment_score: 0.78
        },
        {
          item_id: 'ITEM-C',
          item_name: '価格表',
          alignment_score: 0.85
        }
      ],
      overall_alignment_score: 0.85,
      total_items_scored: 3,
      evaluated_at: new Date('2024-01-15T11:00:00Z')
    });

    expect(score_result.overall_alignment_score).toBe(0.85);
    expect(score_result.item_scores.length).toBe(3);
    expect(score_result.item_scores[0].alignment_score).toBe(0.92);
    expect(score_result.item_scores[1].alignment_score).toBe(0.78);
    expect(score_result.item_scores[2].alignment_score).toBe(0.85);
  });
});