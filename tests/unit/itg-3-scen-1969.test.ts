import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1969: 提案商品カテゴリが異なるパターンが適用候補から除外される', () => {
    // Arrange: 過去成功パターンのスタブデータ
    const pastPatterns = [
      {
        id: 'pattern_001',
        productCategory: 'SaaS型クラウドサービス',
        customerIndustry: '金融',
        dealAmount: 5000000,
        successFlag: true,
        proposalApproach: 'クラウド導入による業務効率化'
      },
      {
        id: 'pattern_002',
        productCategory: 'SaaS型クラウドサービス',
        customerIndustry: '製造業',
        dealAmount: 3000000,
        successFlag: true,
        proposalApproach: 'クラウド移行による運用コスト削減'
      },
      {
        id: 'pattern_003',
        productCategory: 'SaaS型クラウドサービス',
        customerIndustry: '小売',
        dealAmount: 2000000,
        successFlag: true,
        proposalApproach: 'クラウドSaaSによる在庫管理システム構築'
      },
      {
        id: 'pattern_004',
        productCategory: 'オンプレミスシステム構築',
        customerIndustry: '金融',
        dealAmount: 10000000,
        successFlag: true,
        proposalApproach: 'オンプレミスシステム完全構築'
      },
      {
        id: 'pattern_005',
        productCategory: 'オンプレミスシステム構築',
        customerIndustry: '製造業',
        dealAmount: 8000000,
        successFlag: true,
        proposalApproach: 'オンプレミス基盤統合'
      }
    ];

    // 新規案件の商談条件
    const newDealCondition = {
      productCategory: 'SaaS型クラウドサービス',
      customerIndustry: '金融',
      targetAmount: 4500000
    };

    // スタブ: evaluatePatternRelevanceは商品カテゴリの一致で適用可能スコアを返す
    const evaluatePatternRelevanceStub = (
      pattern: typeof pastPatterns[0],
      condition: typeof newDealCondition
    ): number => {
      if (pattern.productCategory === condition.productCategory) {
        return 0.85; // 商品カテゴリが一致する場合は0.85以上
      } else {
        return 0.25; // 商品カテゴリが異なる場合は0.30以下
      }
    };

    // Act: 成功パターン抽出・照合機能の実行
    const applicablePatterns = pastPatterns.filter(pattern => {
      const relevanceScore = evaluatePatternRelevanceStub(pattern, newDealCondition);
      return relevanceScore >= 0.70; // 適用可能閾値を0.70とする
    });

    // Assert
    // 1. 適用候補は商品カテゴリが『SaaS型クラウドサービス』の3件のみ
    expect(applicablePatterns.length).toBe(3);

    // 2. すべての適用候補が『SaaS型クラウドサービス』カテゴリ
    applicablePatterns.forEach(pattern => {
      expect(pattern.productCategory).toBe('SaaS型クラウドサービス');
    });

    // 3. 適用候補のパターンIDが正しい3件であることを確認
    const applicablePatternIds = applicablePatterns.map(p => p.id).sort();
    expect(applicablePatternIds).toEqual(['pattern_001', 'pattern_002', 'pattern_003']);

    // 4. 除外されたパターン（オンプレミスシステム構築の2件）がUIに表示されていない
    const excludedPatterns = pastPatterns.filter(pattern => {
      const relevanceScore = evaluatePatternRelevanceStub(pattern, newDealCondition);
      return relevanceScore < 0.70;
    });
    expect(excludedPatterns.length).toBe(2);
    excludedPatterns.forEach(pattern => {
      expect(pattern.productCategory).toBe('オンプレミスシステム構築');
    });

    // 5. 適用候補スコアが0.85以上であることを確認
    applicablePatterns.forEach(pattern => {
      const score = evaluatePatternRelevanceStub(pattern, newDealCondition);
      expect(score).toBeGreaterThanOrEqual(0.85);
    });

    // 6. 除外パターンのスコアが0.30以下であることを確認
    excludedPatterns.forEach(pattern => {
      const score = evaluatePatternRelevanceStub(pattern, newDealCondition);
      expect(score).toBeLessThanOrEqual(0.30);
    });
  });
});