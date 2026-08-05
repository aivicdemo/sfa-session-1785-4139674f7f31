import { initializeAuditDashboard } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-494
  test('営業案件データが空の場合、エラーを返す', () => {
    const empty_sales_projects: any[] = [];

    const result = initializeAuditDashboard({
      sales_projects: empty_sales_projects,
    });

    expect(result).toEqual({
      error: {
        code: 'NO_SALES_DATA',
        message: '営業案件データが存在しません',
      },
    });
  });
});