import { calculateSuccessPatternAlignment } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-601
  test('[normal] 顧客対応パターンが成功パターンと全く合致していない場合、合致度が0として数値化される', () => {
    const sales_person_id = 'sales_001';
    const contact_frequency_actual = 1;
    const proposal_content_actual = 'product_x';
    const response_time_zone_actual = 'night';
    const success_pattern = {
      contact_frequency_required: 5,
      proposal_content_required: 'product_y',
      response_time_zone_required: 'business_hours',
    };

    const alignment_score = calculateSuccessPatternAlignment(
      sales_person_id,
      {
        contact_frequency: contact_frequency_actual,
        proposal_content: proposal_content_actual,
        response_time_zone: response_time_zone_actual,
      },
      success_pattern
    );

    expect(alignment_score).toBe(0);
  });
});