import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-1614: 類似顧客マッチング処理 - 過去顧客の購買日が月末のとき、一致度計算が正常に処理される', () => {
    // 過去顧客データ（購買日が月末 2024-01-31）
    const pastCustomers = [
      {
        customerId: 'CUST-001',
        industryType: 'manufacturing',
        companyScale: 'large',
        purchaseAmount: 500000,
        purchaseDate: new Date('2024-01-31'),
        productCategory: 'software_license',
        dealConditions: {
          decisionMaker: 'executive',
          budgetApproved: true,
          implementationTimeline: 'immediate'
        }
      },
      {
        customerId: 'CUST-002',
        industryType: 'retail',
        companyScale: 'medium',
        purchaseAmount: 250000,
        purchaseDate: new Date('2024-01-15'),
        productCategory: 'consulting_service',
        dealConditions: {
          decisionMaker: 'manager',
          budgetApproved: true,
          implementationTimeline: 'three_months'
        }
      }
    ];

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      industryType: 'manufacturing',
      companyScale: 'large',
      purchaseAmount: 480000,
      productCategory: 'software_license',
      dealConditions: {
        decisionMaker: 'executive',
        budgetApproved: true,
        implementationTimeline: 'immediate'
      }
    };

    // AIRecommendationEngineの類似顧客マッチング処理を実行
    const similarPatterns = findSimilarPatterns(pastCustomers, newDealCondition);

    // 計算結果が配列であることを検証
    expect(Array.isArray(similarPatterns)).toBe(true);

    // CUST-001（月末購買顧客）が結果に含まれていることを検証
    const cust001Match = similarPatterns.find((pattern: any) => pattern.customerId === 'CUST-001');
    expect(cust001Match).toBeDefined();

    // 一致度スコアが正常な範囲（0.0～1.0）内に収まっていることを検証
    expect(cust001Match.similarityScore).toBeGreaterThanOrEqual(0.0);
    expect(cust001Match.similarityScore).toBeLessThanOrEqual(1.0);

    // スコアが数値であること、NaN や無限大でないことを検証
    expect(typeof cust001Match.similarityScore).toBe('number');
    expect(Number.isFinite(cust001Match.similarityScore)).toBe(true);

    // 月末購買顧客は高い一致度を持つ（新規案件と共通属性が多い）
    expect(cust001Match.similarityScore).toBeGreaterThan(0.7);

    // ランキングリストが一致度スコアの降順で並んでいることを確認
    if (similarPatterns.length > 1) {
      for (let i = 0; i < similarPatterns.length - 1; i++) {
        expect(similarPatterns[i].similarityScore).toBeGreaterThanOrEqual(
          similarPatterns[i + 1].similarityScore
        );
      }
    }

    // 月末日付が原因の日付パースエラーが発生していないことを暗黙的に検証
    // （エラーが発生していれば、findSimilarPatternsは例外をスロー）
    expect(similarPatterns.length).toBeGreaterThan(0);
  });
});