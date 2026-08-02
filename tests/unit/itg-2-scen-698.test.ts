import { calculateProposalNeedsAlignment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-698
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客ニーズが複数件のとき、全件に対するスコアが算出される', () => {
    const customerNeeds = [
      {
        needId: 'need_001',
        needName: '低コスト化',
        needDescription: 'コスト削減による競争力強化',
        priority: 1,
      },
      {
        needId: 'need_002',
        needName: '納期短縮',
        needDescription: '市場投入までの期間短縮',
        priority: 2,
      },
      {
        needId: 'need_003',
        needName: '品質向上',
        needDescription: '製品品質の向上と不良率低減',
        priority: 3,
      },
    ];

    const proposalData = {
      proposalId: 'prop_001',
      productName: '製品A',
      priceRange: 'mid',
      deliveryDays: 14,
      qualitySpec: 'ISO9001',
      specifications: {
        cost_indicator: 75,
        delivery_indicator: 80,
        quality_indicator: 85,
      },
    };

    const result = calculateProposalNeedsAlignment(customerNeeds, proposalData);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    expect(result[0]).toBeDefined();
    expect(typeof result[0].alignmentScore).toBe('number');
    expect(result[0].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[0].alignmentScore).toBeLessThanOrEqual(100);
    expect(result[0].needId).toBe('need_001');

    expect(result[1]).toBeDefined();
    expect(typeof result[1].alignmentScore).toBe('number');
    expect(result[1].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[1].alignmentScore).toBeLessThanOrEqual(100);
    expect(result[1].needId).toBe('need_002');

    expect(result[2]).toBeDefined();
    expect(typeof result[2].alignmentScore).toBe('number');
    expect(result[2].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[2].alignmentScore).toBeLessThanOrEqual(100);
    expect(result[2].needId).toBe('need_003');

    const scoreSum = result.reduce((sum, item) => sum + item.alignmentScore, 0);
    expect(scoreSum).toBeGreaterThan(0);
  });
});