import { calculateDeviationFromTeamAverage } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-868
  test('チーム平均との乖離度判定機能 - 個別営業担当者の提案精度とチーム平均との乖離度が正常に算出される', () => {
    const individual_proposal_accuracy_a = 75;
    const individual_proposal_accuracy_b = 80;
    const individual_proposal_accuracy_c = 70;
    const team_average_proposal_accuracy = 75;

    const deviation_a = calculateDeviationFromTeamAverage(
      individual_proposal_accuracy_a,
      team_average_proposal_accuracy
    );

    const deviation_b = calculateDeviationFromTeamAverage(
      individual_proposal_accuracy_b,
      team_average_proposal_accuracy
    );

    const deviation_c = calculateDeviationFromTeamAverage(
      individual_proposal_accuracy_c,
      team_average_proposal_accuracy
    );

    expect(deviation_a).toBe(0);
    expect(deviation_b).toBe(5);
    expect(deviation_c).toBe(-5);
  });
});