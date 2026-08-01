import { analyzePatternAlignment } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-392
  test('顧客対応パターンが成功パターンと全く合致していない場合、合致度が0.0として数値化される', () => {
    const success_pattern_elements = [
      'follow_up_within_3_days',
      'proposal_material_advance_delivery',
      'face_to_face_hearing'
    ];

    const sales_rep_behavior = {
      follow_up_timing_days: 14,
      proposal_material_delivery_method: 'post_delivery',
      meeting_method: 'phone_only'
    };

    const pattern_mapping = {
      follow_up_within_3_days: (behavior: typeof sales_rep_behavior) => behavior.follow_up_timing_days <= 3,
      proposal_material_advance_delivery: (behavior: typeof sales_rep_behavior) => behavior.proposal_material_delivery_method === 'advance_delivery',
      face_to_face_hearing: (behavior: typeof sales_rep_behavior) => behavior.meeting_method === 'face_to_face'
    };

    const result = analyzePatternAlignment(
      sales_rep_behavior,
      success_pattern_elements,
      pattern_mapping
    );

    expect(result.alignment_score).toBe(0.0);
  });
});