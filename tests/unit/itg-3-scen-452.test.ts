import { extractSalesRepresentativesByImprovementItem } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者別改善対象抽出機能', () => {
  // SCEN-452
  test('改善対象項目を所有する営業担当者が1人の場合、その担当者が抽出される', () => {
    // テストデータ: 改善対象項目『顧客フォローアップ頻度』を持つ営業担当者『田中太郎』（ID: SALES-001）
    const salesRepresentativeMaster = [
      {
        id: 'SALES-001',
        name: '田中太郎',
        improvementItems: ['顧客フォローアップ頻度'],
      },
    ];

    // テストデータ: 同じ改善対象項目『顧客フォローアップ頻度』に関連する過去商談データ3件
    const relatedDeals = [
      {
        dealId: 'DEAL-001',
        ownerId: 'SALES-001',
        improvementItem: '顧客フォローアップ頻度',
      },
      {
        dealId: 'DEAL-002',
        ownerId: 'SALES-001',
        improvementItem: '顧客フォローアップ頻度',
      },
      {
        dealId: 'DEAL-003',
        ownerId: 'SALES-001',
        improvementItem: '顧客フォローアップ頻度',
      },
    ];

    // AIRecommendationEngineのスタブ
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
      }),
    };

    // 営業担当者別改善対象抽出機能を実行
    const result = extractSalesRepresentativesByImprovementItem(
      '顧客フォローアップ頻度',
      salesRepresentativeMaster,
      relatedDeals,
      aiRecommendationEngineStub
    );

    // 期待結果の検証
    expect(result).toEqual({
      salesRepresentativeId: 'SALES-001',
      salesRepresentativeName: '田中太郎',
      improvementItems: ['顧客フォローアップ頻度'],
      relatedDealCount: 3,
      relevanceScore: 0.85,
    });

    // 複数営業担当者の混在がないことを確認
    expect(Array.isArray(result)).toBe(false);
    expect(result.salesRepresentativeId).toBe('SALES-001');
  });
});