import { evaluateProposalApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-286
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 提案アプローチの実装難度が高い場合でも、成功率が基準値以上なら適用可能と判定される', () => {
    const systemConfig = {
      successRateThreshold: 80,
    };

    const proposalApproach = {
      implementationDifficulty: 'high',
      successRate: 85,
    };

    const result = evaluateProposalApproach(proposalApproach, systemConfig);

    expect(result.status).toBe('適用可能');
    expect(result.successRate).toBe(85);
    expect(result.threshold).toBe(80);
    expect(result.detail).toBe(
      '成功率が基準値以上のため、実装難度の高さにかかわらず適用を推奨します'
    );
  });
});