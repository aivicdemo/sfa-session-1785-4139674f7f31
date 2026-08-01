import { judgeProposalApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-279
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 判断根拠に提案実行タイミングの理由が含まれている', () => {
    const salesStage = '提案準備期';
    const customerMaturity = '成長段階';
    const competitiveEnvironment = '中程度';
    
    const result = judgeProposalApproach({
      salesStage,
      customerMaturity,
      competitiveEnvironment,
    });

    expect(result.proposedApproach).toBe('即時提案');
    expect(result.judgmentReasoning).toContain('提案実行タイミング');
    expect(result.judgmentReasoning).toContain('早期段階での提案により顧客の購買意欲が高い状態でのエンゲージメントが可能');
  });
});