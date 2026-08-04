import { extractSalesRepsByImprovementItem } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-452: 営業担当者別改善対象抽出機能 - 改善対象項目を所有する営業担当者が1人の場合、その担当者が抽出される', () => {
    // テストデータ: 営業担当者『田中太郎』（ID: SALES-001）
    const salesRepresentativeId = 'SALES-001';
    const salesRepresentativeName = '田中太郎';
    const improvementItemName = '顧客フォローアップ頻度';

    // テストデータ: 改善対象項目『顧客フォローアップ頻度』に関連する過去商談データ3件
    const relatedDealIds = ['DEAL-001', 'DEAL-002', 'DEAL-003'];

    // AIRecommendationEngineのスタブ
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.85
      })
    };

    // テスト実行
    const result = extractSalesRepsByImprovementItem(
      {
        improvementItem: improvementItemName,
        aiEngine: aiRecommendationEngineStub,
        salesRepresentatives: [
          {
            id: salesRepresentativeId,
            name: salesRepresentativeName,
            improvementItems: [improvementItemName]
          }
        ],
        deals: [
          {
            id: relatedDealIds[0],
            ownerId: salesRepresentativeId,
            improvementItemRef: improvementItemName
          },
          {
            id: relatedDealIds[1],
            ownerId: salesRepresentativeId,
            improvementItemRef: improvementItemName
          },
          {
            id: relatedDealIds[2],
            ownerId: salesRepresentativeId,
            improvementItemRef: improvementItemName
          }
        ]
      }
    );

    // 期待結果の検証
    expect(result).toEqual({
      salesRepresentativeId: 'SALES-001',
      salesRepresentativeName: '田中太郎',
      improvementItems: ['顧客フォローアップ頻度'],
      relatedDealCount: 3,
      relevanceScore: 0.85
    });

    // 複数営業担当者の混在がないことを確認
    expect(Array.isArray(result.improvementItems)).toBe(true);
    expect(result.improvementItems.length).toBe(1);
    expect(result.improvementItems[0]).toBe('顧客フォローアップ頻度');
  });
});