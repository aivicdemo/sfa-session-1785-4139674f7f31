import { extractSalesStaffByImprovementItem } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者別改善対象抽出', () => {
  test('SCEN-453: 改善対象項目を所有する複数営業担当者が全員抽出される', () => {
    // テストデータ設定
    const improvementItemName = '顧客ニーズ把握プロセス';
    
    const salesStaff = [
      {
        id: 'staff_001',
        name: '営業太郎',
        improvementItemIds: ['item_001']
      },
      {
        id: 'staff_002',
        name: '営業花子',
        improvementItemIds: ['item_001']
      },
      {
        id: 'staff_003',
        name: '営業次郎',
        improvementItemIds: ['item_001']
      }
    ];

    const improvementItems = [
      {
        id: 'item_001',
        name: '顧客ニーズ把握プロセス',
        description: '顧客ニーズを適切に把握するプロセス'
      }
    ];

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        confidence: 85,
        approach: 'テスト推奨アプローチ'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('推奨根拠説明'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85)
    };

    // 改善対象項目抽出機能を実行
    const result = extractSalesStaffByImprovementItem(
      improvementItemName,
      salesStaff,
      improvementItems,
      mockAIEngine
    );

    // 取得した所有営業担当者一覧を確認
    expect(result.ownerCount).toBe(3);
    expect(result.owners).toHaveLength(3);
    
    // 抽出された営業担当者の名前を確認
    const ownerNames = result.owners.map(owner => owner.name).sort();
    expect(ownerNames).toEqual(['営業太郎', '営業花子', '営業次郎']);
    
    // 各営業担当者が重複なく含まれていることを確認
    const uniqueOwnerIds = new Set(result.owners.map(owner => owner.id));
    expect(uniqueOwnerIds.size).toBe(3);
    
    // 抽出された営業担当者のID確認
    const ownerIds = result.owners.map(owner => owner.id).sort();
    expect(ownerIds).toEqual(['staff_001', 'staff_002', 'staff_003']);
  });
});