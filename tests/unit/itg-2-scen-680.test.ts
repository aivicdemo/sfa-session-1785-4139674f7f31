import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-680
  test('推奨根拠が作成日時から今日までの期間ちょうど30日のとき、根拠として含まれる', () => {
    const mockCurrentDate = new Date('2024-01-15T10:00:00Z');
    const recommendationBasisCreatedAt = new Date('2023-12-16T10:00:00Z');

    const recommendationBasisData = {
      id: 'basis_001',
      recommendationId: 'rec_001',
      createdAt: recommendationBasisCreatedAt,
      reason: '過去の類似案件で同じニーズパターンが成功',
      evidenceType: 'historical_case',
      confidence: 0.95,
    };

    const result = visualizeRecommendationBasis(
      [recommendationBasisData],
      mockCurrentDate
    );

    expect(result.visibleBases).toHaveLength(1);
    expect(result.visibleBases[0].id).toBe('basis_001');
    expect(result.visibleBases[0].createdAt).toEqual(recommendationBasisCreatedAt);
    expect(result.daysFromCreation).toBe(30);
  });
});