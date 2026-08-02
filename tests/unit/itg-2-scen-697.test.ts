import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-697: 提案資料と顧客ニーズの適合度スコア化機能 - 顧客ニーズが1件のとき、スコアが正常に算出される', () => {
    const customerNeeds = [
      {
        needsId: 'NEED-001',
        content: 'クラウド基盤の構築',
        category: 'infrastructure',
        priority: 1,
      },
    ];

    const proposalDocument = {
      proposalId: 'PROP-001',
      items: [
        {
          itemId: 'ITEM-001',
          title: 'クラウド基盤システム構築サービス',
          description: 'AWS/Azure/GCPを活用した安全なクラウド基盤を構築',
          relatedKeywords: ['cloud', 'infrastructure', 'security'],
        },
        {
          itemId: 'ITEM-002',
          title: 'クラウドセキュリティ対策',
          description: 'クラウド環境のセキュリティ強化と監視体制の整備',
          relatedKeywords: ['security', 'cloud', 'monitoring'],
        },
        {
          itemId: 'ITEM-003',
          title: 'クラウドコスト最適化',
          description: 'クラウドリソースの効率的な利用とコスト削減',
          relatedKeywords: ['cloud', 'cost', 'optimization'],
        },
      ],
    };

    const alignmentScore = calculateProposalNeedsAlignmentScore(
      customerNeeds,
      proposalDocument,
    );

    expect(typeof alignmentScore).toBe('number');
    expect(alignmentScore).toBeGreaterThanOrEqual(0);
    expect(alignmentScore).toBeLessThanOrEqual(100);
    expect(alignmentScore).toBe(85);
  });
});