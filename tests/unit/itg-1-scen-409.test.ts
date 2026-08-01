import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-409
  test('単一の営業担当者の分析結果が含まれる場合、その営業担当者のレポートが正確に生成される', () => {
    const employee_id = 'EMP001';
    const visit_count = 12;
    const deal_count = 3;
    const avg_meeting_duration_minutes = 45;
    const proposal_document_count = 8;
    const conversion_rate = 25;
    const behavior_pattern = '定期訪問型';

    const input_data = {
      employee_id: employee_id,
      visit_count: visit_count,
      deal_count: deal_count,
      avg_meeting_duration_minutes: avg_meeting_duration_minutes,
      proposal_document_count: proposal_document_count,
    };

    const result = generateSalesRepBehaviorAnalysisReport(input_data);

    expect(result.employee_id).toBe(employee_id);
    expect(result.visit_count).toBe(visit_count);
    expect(result.deal_count).toBe(deal_count);
    expect(result.conversion_rate).toBe(conversion_rate);
    expect(result.avg_meeting_duration_minutes).toBe(avg_meeting_duration_minutes);
    expect(result.proposal_document_count).toBe(proposal_document_count);
    expect(result.behavior_pattern).toBe(behavior_pattern);
    expect(result.other_employee_data_mixed).toBe(false);
  });
});