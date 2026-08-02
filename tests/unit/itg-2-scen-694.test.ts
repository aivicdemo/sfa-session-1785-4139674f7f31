import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-694
  test('提案資料の全項目が顧客ニーズと不適合で、スコア0が算出される', () => {
    const proposal_material = {
      product_feature: 'クラウドベース在庫管理システム',
      price_range: '50万円～100万円',
      delivery_period: '6ヶ月',
      support_system: 'メール対応'
    };

    const customer_needs = {
      product_feature: 'オンプレミス型ERP',
      price_range: '200万円～500万円',
      delivery_period: '3ヶ月以内',
      support_system: '24時間電話サポート'
    };

    const result = calculateProposalNeedsAlignmentScore(proposal_material, customer_needs);

    expect(result.overall_score).toBe(0);
    expect(result.alignment_details).toEqual({
      product_feature: { is_aligned: false, alignment_reason: '不適合' },
      price_range: { is_aligned: false, alignment_reason: '不適合' },
      delivery_period: { is_aligned: false, alignment_reason: '不適合' },
      support_system: { is_aligned: false, alignment_reason: '不適合' }
    });
    expect(result.mismatch_count).toBe(4);
  });
});