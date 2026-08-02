import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-659
  test('推奨履歴から過去推奨内容が1件のとき、その履歴が根拠として組み込まれる', () => {
    const dealId = 'DEAL-001';
    const recommendationHistory = [
      {
        recommendationId: 'REC-001',
        dealId: dealId,
        recommendationContent: '顧客Aへのアプローチ方法変更',
        recommendationDateTime: '2024-01-15 10:30',
      },
    ];

    const result = visualizeRecommendationBasis(dealId, recommendationHistory);

    expect(result).toEqual({
      basisData: [
        {
          recommendationId: 'REC-001',
          recommendationContent: '顧客Aへのアプローチ方法変更',
          recommendationDateTime: '2024-01-15 10:30',
        },
      ],
      basisCount: 1,
    });
    expect(result.basisCount).toBe(1);
    expect(result.basisData[0].recommendationId).toBe('REC-001');
    expect(result.basisData[0].recommendationContent).toBe('顧客Aへのアプローチ方法変更');
    expect(result.basisData[0].recommendationDateTime).toBe('2024-01-15 10:30');
  });
});