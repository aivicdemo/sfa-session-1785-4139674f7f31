import { evaluateTeamComplianceAcquisitionCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('Team Sales Process Understanding Completion Judgment', () => {
  // SCEN-1009: [normal] チーム全体周知完了判定機能 - 全営業担当者が理解度確認テストを提出かつ実務適用報告を提出した場合、周知完了と判定される
  test('should determine team acquisition completion as completed when all sales reps submitted understanding test and practical application reports', () => {
    const team_id = 'TEAM-20240115-001';
    const guideline_id = 'GUIDELINE-20240110-001';
    const current_time = new Date('2024-01-15T14:30:00Z');

    const sales_rep_a_id = 'REP-A-001';
    const sales_rep_b_id = 'REP-B-002';
    const sales_rep_c_id = 'REP-C-003';

    const team_members = [
      {
        rep_id: sales_rep_a_id,
        rep_name: 'Yamada Taro',
        guideline_id: guideline_id,
        understanding_test_submitted: true,
        understanding_test_score: 85,
        understanding_test_submission_date: new Date('2024-01-13T10:15:00Z'),
        practical_application_report_submitted: true,
        practical_application_report: {
          customer_name: 'ABC Corporation',
          action_content: 'Presented solution proposal based on customer needs analysis',
          implementation_datetime: new Date('2024-01-14T09:30:00Z'),
        },
        practical_application_report_submission_date: new Date('2024-01-14T16:45:00Z'),
      },
      {
        rep_id: sales_rep_b_id,
        rep_name: 'Suzuki Hanako',
        guideline_id: guideline_id,
        understanding_test_submitted: true,
        understanding_test_score: 92,
        understanding_test_submission_date: new Date('2024-01-12T14:20:00Z'),
        practical_application_report_submitted: true,
        practical_application_report: {
          customer_name: 'XYZ Inc',
          action_content: 'Applied success pattern matching to customer acquisition approach',
          implementation_datetime: new Date('2024-01-13T11:00:00Z'),
        },
        practical_application_report_submission_date: new Date('2024-01-13T17:30:00Z'),
      },
      {
        rep_id: sales_rep_c_id,
        rep_name: 'Tanaka Jiro',
        guideline_id: guideline_id,
        understanding_test_submitted: true,
        understanding_test_score: 78,
        understanding_test_submission_date: new Date('2024-01-11T15:45:00Z'),
        practical_application_report_submitted: true,
        practical_application_report: {
          customer_name: 'DEF Corporation',
          action_content: 'Executed follow-up timing recommendation based on customer signal analysis',
          implementation_datetime: new Date('2024-01-12T10:20:00Z'),
        },
        practical_application_report_submission_date: new Date('2024-01-12T18:15:00Z'),
      },
    ];

    const result = evaluateTeamComplianceAcquisitionCompletion(
      team_id,
      guideline_id,
      team_members,
      current_time
    );

    expect(result.completion_status).toBe('completed');
    expect(result.completion_datetime).toEqual(new Date('2024-01-15T14:30:00Z'));
    expect(result.all_understanding_tests_submitted).toBe(true);
    expect(result.understanding_test_submission_count).toBe(3);
    expect(result.all_practical_application_reports_submitted).toBe(true);
    expect(result.practical_application_report_submission_count).toBe(3);
    expect(result.team_members_evaluated).toBe(3);
    expect(result.minimum_passing_score_met).toBe(true);
    expect(result.lowest_understanding_test_score).toBe(78);
    expect(result.progress_display_text).toBe(
      'All sales representatives submitted understanding confirmation test, all sales representatives submitted practical application report'
    );
  });
});