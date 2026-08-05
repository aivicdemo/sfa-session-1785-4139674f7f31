import { analyzeTeamAwarenessCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('チーム全体周知完了判定機能', () => {
  // SCEN-1011
  test('一部営業担当者が実務適用報告のみ提出した場合、周知未完了と判定される', () => {
    const team_members = [
      {
        sales_rep_id: 'A001',
        sales_rep_name: 'Sales Rep A',
        team_id: 'TEAM001',
      },
      {
        sales_rep_id: 'B001',
        sales_rep_name: 'Sales Rep B',
        team_id: 'TEAM001',
      },
      {
        sales_rep_id: 'C001',
        sales_rep_name: 'Sales Rep C',
        team_id: 'TEAM001',
      },
    ];

    const notification_document = {
      doc_id: 'DOC001',
      title: '営業プロセス変更通知',
      assigned_team_id: 'TEAM001',
      created_at: '2024-01-15T10:00:00Z',
    };

    const submission_reports = [
      {
        sales_rep_id: 'A001',
        doc_id: 'DOC001',
        status: '実務適用報告',
        submitted_at: '2024-01-16T09:00:00Z',
      },
      {
        sales_rep_id: 'B001',
        doc_id: 'DOC001',
        status: '実務適用報告',
        submitted_at: '2024-01-16T10:30:00Z',
      },
    ];

    const result = analyzeTeamAwarenessCompletion({
      team_members,
      notification_document,
      submission_reports,
    });

    expect(result.completion_status).toBe('周知未完了');
    expect(result.unsubmitted_rep_ids).toContain('C001');
    expect(result.unsubmitted_rep_ids.length).toBe(1);
    expect(result.completion_rate).toBe(66.7);
  });
});