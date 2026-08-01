import { generateSalesPersonActivityAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-613
  test('[normal] 過去3ヶ月間の営業担当者複数名の場合、全担当者の統計値が正常に計算される', () => {
    const sales_person_a = {
      sales_person_id: 'SP001',
      sales_person_name: '営業担当者A',
      visit_count: 15,
      meeting_count: 8,
      contract_count: 2,
      average_meeting_time_minutes: 45,
    };

    const sales_person_b = {
      sales_person_id: 'SP002',
      sales_person_name: '営業担当者B',
      visit_count: 12,
      meeting_count: 6,
      contract_count: 1,
      average_meeting_time_minutes: 50,
    };

    const sales_person_c = {
      sales_person_id: 'SP003',
      sales_person_name: '営業担当者C',
      visit_count: 18,
      meeting_count: 10,
      contract_count: 3,
      average_meeting_time_minutes: 40,
    };

    const sales_person_records = [sales_person_a, sales_person_b, sales_person_c];

    const start_date = new Date('2024-09-01T00:00:00Z');
    const end_date = new Date('2024-11-30T23:59:59Z');

    const result = generateSalesPersonActivityAnalysisReport(
      sales_person_records,
      start_date,
      end_date,
    );

    const expected_total_visits = 15 + 12 + 18;
    const expected_total_meetings = 8 + 6 + 10;
    const expected_total_contracts = 2 + 1 + 3;
    const expected_average_meeting_time = (45 + 50 + 40) / 3;

    expect(result.report_period_start).toBe('2024-09-01');
    expect(result.report_period_end).toBe('2024-11-30');
    expect(result.total_visits).toBe(expected_total_visits);
    expect(result.total_meetings).toBe(expected_total_meetings);
    expect(result.total_contracts).toBe(expected_total_contracts);
    expect(result.average_meeting_time_minutes).toBe(expected_average_meeting_time);
    expect(result.sales_person_count).toBe(3);
    expect(result.sales_people).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sales_person_id: 'SP001',
          sales_person_name: '営業担当者A',
          visit_count: 15,
          meeting_count: 8,
          contract_count: 2,
          average_meeting_time_minutes: 45,
        }),
        expect.objectContaining({
          sales_person_id: 'SP002',
          sales_person_name: '営業担当者B',
          visit_count: 12,
          meeting_count: 6,
          contract_count: 1,
          average_meeting_time_minutes: 50,
        }),
        expect.objectContaining({
          sales_person_id: 'SP003',
          sales_person_name: '営業担当者C',
          visit_count: 18,
          meeting_count: 10,
          contract_count: 3,
          average_meeting_time_minutes: 40,
        }),
      ]),
    );
  });
});