import { aggregateImprovementItemsBySalesPerson } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-454: 営業担当者別改善対象抽出機能 - 複数の改善対象項目が同一営業担当者に属する場合、担当者ごとに項目が集約される', () => {
    // テスト用の改善対象項目データセット準備
    const improvementItems = [
      {
        id: 'item_001',
        salesPersonId: 'S001',
        salesPersonName: '営業担当者A',
        category: '提案資料作成スキル',
        description: '提案資料の品質向上が必要',
        priority: 1,
      },
      {
        id: 'item_002',
        salesPersonId: 'S001',
        salesPersonName: '営業担当者A',
        category: '顧客ヒアリング記録',
        description: 'ヒアリング記録の完全性向上が必要',
        priority: 2,
      },
      {
        id: 'item_003',
        salesPersonId: 'S001',
        salesPersonName: '営業担当者A',
        category: 'フォローアップメール送付',
        description: 'フォローアップメール送付率の向上が必要',
        priority: 3,
      },
      {
        id: 'item_004',
        salesPersonId: 'S002',
        salesPersonName: '営業担当者B',
        category: '顧客情報入力',
        description: '顧客情報入力の精度向上が必要',
        priority: 1,
      },
    ];

    // AIRecommendationEngineのモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn((item) => {
        return {
          itemId: item.id,
          recommendation: `${item.category}に関する改善提案`,
          confidenceScore: 85,
        };
      }),
    };

    // 営業担当者別改善対象抽出機能を実行
    const result = aggregateImprovementItemsBySalesPerson(
      improvementItems,
      mockAIEngine
    );

    // 返却された結果を検証
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          salesPersonId: 'S001',
          salesPersonName: '営業担当者A',
          aggregatedItemCount: 3,
          itemIds: ['item_001', 'item_002', 'item_003'],
        }),
        expect.objectContaining({
          salesPersonId: 'S002',
          salesPersonName: '営業担当者B',
          aggregatedItemCount: 1,
          itemIds: ['item_004'],
        }),
      ])
    );

    // 営業担当者S001に属する集約グループの詳細検証
    const s001Group = result.find(
      (group) => group.salesPersonId === 'S001'
    );
    expect(s001Group).toBeDefined();
    expect(s001Group.aggregatedItemCount).toBe(3);
    expect(s001Group.itemIds).toEqual(['item_001', 'item_002', 'item_003']);
    expect(s001Group.salesPersonName).toBe('営業担当者A');

    // AIエンジンが各改善対象項目に対して呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(4);
  });
});