import { calculateTeamAverageDeviationMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム平均との乖離度判定機能', () => {
  // SCEN-865
  test('提案精度のチーム平均値が正常に算出される', () => {
    const salesRepresentatives = [
      {
        id: 'rep_001',
        name: '営業担当者A',
        teamId: 'team_001',
        proposalAccuracy: 85.0,
      },
      {
        id: 'rep_002',
        name: '営業担当者B',
        teamId: 'team_001',
        proposalAccuracy: 90.0,
      },
      {
        id: 'rep_003',
        name: '営業担当者C',
        teamId: 'team_001',
        proposalAccuracy: 80.0,
      },
    ];

    const result = calculateTeamAverageDeviationMetrics({
      salesRepresentatives,
      teamId: 'team_001',
    });

    expect(result.teamAverageProposalAccuracy).toBe(85.0);
  });
});