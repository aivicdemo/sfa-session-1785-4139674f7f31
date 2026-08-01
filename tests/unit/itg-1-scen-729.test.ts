import { determineTeamComplianceCompletion } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-729
  test('成功パターン適用ガイドラインの周知完了判定機能 - 理解度スコアが0のときチーム全体の周知完了判定に含まれる', () => {
    const teamId = 'team-001';
    const salesRepAId = 'salesperson-A';
    const salesRepBId = 'salesperson-B';
    const salesRepCId = 'salesperson-C';

    const guidanceDistributions = [
      {
        salesPersonId: salesRepAId,
        teamId: teamId,
        comprehensionScore: 0,
        distributionDate: '2024-01-15T10:00:00Z',
      },
      {
        salesPersonId: salesRepBId,
        teamId: teamId,
        comprehensionScore: 50,
        distributionDate: '2024-01-15T10:00:00Z',
      },
      {
        salesPersonId: salesRepCId,
        teamId: teamId,
        comprehensionScore: 100,
        distributionDate: '2024-01-15T10:00:00Z',
      },
    ];

    const result = determineTeamComplianceCompletion(teamId, guidanceDistributions);

    expect(result.status).toBe('incomplete');
    expect(result.includedSalesPersons).toContain(salesRepAId);
    expect(result.includedSalesPersons).toContain(salesRepBId);
    expect(result.includedSalesPersons).toContain(salesRepCId);
    expect(result.includedSalesPersons.length).toBe(3);
  });
});