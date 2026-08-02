import { priorityAssignment } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-318
  test('[error] 改善指導優先順位の決定 - 改善指導対象のスコアが空値のとき、優先度付与がエラーになる', () => {
    const instructionTarget = {
      employeeId: 'EMP001',
      score: null,
      deviationPattern: 'LOW_PROPOSAL_FREQUENCY'
    };

    expect(() => priorityAssignment(instructionTarget)).toThrow(/改善指導スコア/);
  });
});