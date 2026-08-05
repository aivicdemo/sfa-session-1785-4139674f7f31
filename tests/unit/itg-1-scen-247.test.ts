import { calculateComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-247
  test('標準プロセス遵守度スコア計算機能 - 遵守度スコアが閾値100%未満（99.9%）のとき改善対象と判定される', () => {
    const input = {
      compliancePercentage: 99.9,
    };

    const result = calculateComplianceScore(input);

    expect(result.complianceScore).toBe(99.9);
    expect(result.requiresImprovement).toBe(true);
    expect(result.improvementStatus).toBe('要改善');
  });
});