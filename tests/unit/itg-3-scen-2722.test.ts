import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジックの精度検証', () => {
  // SCEN-2722
  test('同じ顧客・商談条件で複数回実行された場合、毎回同じ推奨結果が返される', () => {
    // Arrange: AIRecommendationEngineのスタブをセットアップ
    const stubRecommendationEngine = {
      generateRecommendation: jest.fn(
        (customerId: string, dealStage: string, productCategory: string, budgetAmount: number) => {
          // 同じ入力に対して毎回同じ結果を返す
          return {
            recommendationId: 'REC-20240115-001',
            proposedProduct: 'クラウドERPシステム',
            proposedApproach: '3段階導入アプローチ：Phase1段階的移行，Phase2プロセス最適化，Phase3全社展開',
            confidenceScore: 87,
            explanation: '当社は過去12件の類似案件（製造業・従業員500～1000名・予算規模1500万～2000万円）から、段階的導入アプローチにより成功率95%を達成。御社の予算規模（1800万円）と業種（製造業）、スタッフ規模（750名）は最適マッチ。同様パターンで平均8ヶ月で完全移行・ROI20%達成実績あり。'
          };
        }
      )
    };

    // テスト用の顧客・商談条件を定義
    const customerId = 'CUST-20240115-001';
    const dealStage = 'proposal_phase';
    const productCategory = 'ERP_system';
    const budgetAmount = 1800;

    // Act & Assert: 1回目の呼び出し
    const firstRecommendation = generateRecommendation(
      stubRecommendationEngine,
      customerId,
      dealStage,
      productCategory,
      budgetAmount
    );

    // 1回目の結果を記録
    expect(firstRecommendation).toEqual({
      recommendationId: 'REC-20240115-001',
      proposedProduct: 'クラウドERPシステム',
      proposedApproach: '3段階導入アプローチ：Phase1段階的移行，Phase2プロセス最適化，Phase3全社展開',
      confidenceScore: 87,
      explanation: '当社は過去12件の類似案件（製造業・従業員500～1000名・予算規模1500万～2000万円）から、段階的導入アプローチにより成功率95%を達成。御社の予算規模（1800万円）と業種（製造業）、スタッフ規模（750名）は最適マッチ。同様パターンで平均8ヶ月で完全移行・ROI20%達成実績あり。'
    });

    // Act & Assert: 2回目の呼び出し
    const secondRecommendation = generateRecommendation(
      stubRecommendationEngine,
      customerId,
      dealStage,
      productCategory,
      budgetAmount
    );

    // 2回目の結果と1回目を比較
    expect(secondRecommendation.recommendationId).toBe(firstRecommendation.recommendationId);
    expect(secondRecommendation.proposedProduct).toBe(firstRecommendation.proposedProduct);
    expect(secondRecommendation.proposedApproach).toBe(firstRecommendation.proposedApproach);
    expect(secondRecommendation.confidenceScore).toBe(firstRecommendation.confidenceScore);
    expect(secondRecommendation.explanation).toBe(firstRecommendation.explanation);

    // Act & Assert: 3回目の呼び出し
    const thirdRecommendation = generateRecommendation(
      stubRecommendationEngine,
      customerId,
      dealStage,
      productCategory,
      budgetAmount
    );

    // 3回目の結果と1回目・2回目を比較
    expect(thirdRecommendation.recommendationId).toBe(firstRecommendation.recommendationId);
    expect(thirdRecommendation.proposedProduct).toBe(firstRecommendation.proposedProduct);
    expect(thirdRecommendation.proposedApproach).toBe(firstRecommendation.proposedApproach);
    expect(thirdRecommendation.confidenceScore).toBe(firstRecommendation.confidenceScore);
    expect(thirdRecommendation.explanation).toBe(firstRecommendation.explanation);

    // 3回の呼び出しすべてで同一結果を返していることを確認
    expect(thirdRecommendation).toEqual(firstRecommendation);
    expect(thirdRecommendation).toEqual(secondRecommendation);
  });
});