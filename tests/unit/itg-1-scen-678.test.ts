import { calculatePriorityScoreByPatterns } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-678
  test('[normal] 改善優先度スコア算出機能 - 営業担当者ごとの問題パターンが正しく集計された状態で優先度が算出される', () => {
    const salesRepresentativeA = {
      id: 'sr-001',
      name: '営業担当者A',
      patterns: [
        { type: '提案資料作成遅延', count: 3 },
        { type: '顧客対応ミス', count: 2 },
      ],
    };

    const salesRepresentativeB = {
      id: 'sr-002',
      name: '営業担当者B',
      patterns: [
        { type: '提案資料作成遅延', count: 1 },
        { type: '価格交渉失敗', count: 4 },
      ],
    };

    const salesRepresentativeC = {
      id: 'sr-003',
      name: '営業担当者C',
      patterns: [
        { type: '顧客対応ミス', count: 5 },
      ],
    };

    const salesRepresentatives = [
      salesRepresentativeA,
      salesRepresentativeB,
      salesRepresentativeC,
    ];

    const result = calculatePriorityScoreByPatterns(salesRepresentatives);

    expect(result).toEqual([
      {
        id: 'sr-001',
        name: '営業担当者A',
        priorityScore: 25,
      },
      {
        id: 'sr-002',
        name: '営業担当者B',
        priorityScore: 24,
      },
      {
        id: 'sr-003',
        name: '営業担当者C',
        priorityScore: 20,
      },
    ]);
  });
});