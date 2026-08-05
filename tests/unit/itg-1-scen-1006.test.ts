import { aggregateTeamPracticalApplicationReports } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の実務適用状況集計機能', () => {
  // SCEN-1006
  test('実務適用報告が0件の場合、チーム全体の集計結果として件数0が正しく計算される', () => {
    const salesRepresentative1 = {
      id: 'sr001',
      name: '営業担当者A',
      practicalApplicationReportCount: 0,
    };

    const salesRepresentative2 = {
      id: 'sr002',
      name: '営業担当者B',
      practicalApplicationReportCount: 0,
    };

    const salesRepresentative3 = {
      id: 'sr003',
      name: '営業担当者C',
      practicalApplicationReportCount: 0,
    };

    const teamMembers = [
      salesRepresentative1,
      salesRepresentative2,
      salesRepresentative3,
    ];

    const aggregationResult = aggregateTeamPracticalApplicationReports(teamMembers);

    expect(aggregationResult.totalReportCount).toBe(0);
    expect(typeof aggregationResult.totalReportCount).toBe('number');
  });
});