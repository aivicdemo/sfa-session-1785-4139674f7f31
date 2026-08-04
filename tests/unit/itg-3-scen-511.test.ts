import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者指導方針決定', () => {
  test('SCEN-511: 指導実施期限が過去日時のとき、エラーが発生する', () => {
    // Arrange
    const past_deadline = new Date('2025-01-01T10:00:00Z');
    const current_time = new Date('2025-01-15T14:30:00Z');

    const sales_rep_id = 'SR001';
    const customer_id = 'CUST-12345';
    const deal_condition = {
      industry: 'IT',
      company_scale: 'large',
      deal_stage: 'proposal',
      estimated_amount: 5000000,
    };

    const guidance_request = {
      sales_rep_id,
      customer_id,
      deal_condition,
      guidance_deadline: past_deadline.toISOString(),
      current_timestamp: current_time.toISOString(),
    };

    // Act & Assert
    expect(() => decideSalesGuidancePolicy(guidance_request)).toThrow(/期限/);
  });
});