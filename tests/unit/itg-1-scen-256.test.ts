import { evaluateProposalApproachApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-256
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 顧客業種が登録済みパターンに一致しない場合は適用不可と判定される', () => {
    const successPatternMatrix = [
      {
        industry: '金融業',
        product_category: '金融商品',
        proposal_type: '融資提案',
        success_rate: 0.85,
      },
      {
        industry: '製造業',
        product_category: '生産設備',
        proposal_type: '設備導入提案',
        success_rate: 0.78,
      },
      {
        industry: '小売業',
        product_category: '販売ツール',
        proposal_type: 'POS導入提案',
        success_rate: 0.72,
      },
    ];

    const customerInfo = {
      industry: '農業',
      customer_id: 'CUST-001',
      purchase_frequency: 'monthly',
    };

    const result = evaluateProposalApproachApplicability(
      successPatternMatrix,
      customerInfo
    );

    expect(result.applicable).toBe(false);
    expect(result.determination_reason).toMatch(/農業/);
    expect(result.determination_reason).toMatch(/金融業/);
    expect(result.determination_reason).toMatch(/製造業/);
    expect(result.determination_reason).toMatch(/小売業/);
    expect(result.determination_reason).toMatch(/一致しません/);
  });
});