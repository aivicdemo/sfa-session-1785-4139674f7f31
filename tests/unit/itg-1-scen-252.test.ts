import { identifyApplicableApproachPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-252
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 過去の成功商談パターンが複数件の場合、全て確認して適用可能なものが複数特定される', () => {
    const successPatterns = [
      {
        id: 'pattern_a',
        industry: '製造業',
        product: 'システムA',
        proposalMethod: '直接営業',
      },
      {
        id: 'pattern_b',
        industry: '製造業',
        product: 'システムB',
        proposalMethod: '紹介営業',
      },
      {
        id: 'pattern_c',
        industry: '製造業',
        product: 'システムA',
        proposalMethod: 'Webセミナー',
      },
    ];

    const customerAttributes = {
      industry: '製造業',
      consideringProduct: 'システムA',
    };

    const result = identifyApplicableApproachPatterns(
      successPatterns,
      customerAttributes
    );

    expect(result).toEqual({
      applicableCount: 2,
      patterns: [
        {
          id: 'pattern_a',
          proposalMethod: '直接営業',
        },
        {
          id: 'pattern_c',
          proposalMethod: 'Webセミナー',
        },
      ],
    });
  });
});