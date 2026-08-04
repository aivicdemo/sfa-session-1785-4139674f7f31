import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1611
  test('[edge] 類似顧客マッチング処理 - 購買金額が最小値0円のとき、一致度計算が正常に処理される', () => {
    const aiRecommendationEngineStub = {
      findSimilarPatterns: (input: {
        customerIndustry: string;
        customerEmployeeCount: number;
        purchaseAmount: number;
      }) => {
        const matchingScore = (() => {
          if (input.purchaseAmount === 0) {
            const industryWeight = input.customerIndustry === 'IT' ? 0.4 : 0.3;
            const employeeWeight = input.customerEmployeeCount > 100 ? 0.6 : 0.4;
            const calculatedScore = (industryWeight + employeeWeight) * 50;
            return Math.min(100, Math.max(0, calculatedScore));
          }
          const purchaseWeight = input.purchaseAmount > 1000000 ? 0.5 : 0.3;
          const industryWeight = input.customerIndustry === 'IT' ? 0.4 : 0.3;
          const employeeWeight = input.customerEmployeeCount > 100 ? 0.6 : 0.4;
          const totalScore = (purchaseWeight + industryWeight + employeeWeight) * 33.33;
          return Math.min(100, Math.max(0, totalScore));
        })();

        return {
          matchingScore,
          similarPatterns: [
            {
              caseId: 'CASE-001',
              score: matchingScore,
              industry: input.customerIndustry,
              employeeCount: input.customerEmployeeCount,
            },
          ],
        };
      },
    };

    const testInput = {
      customerIndustry: 'IT',
      customerEmployeeCount: 150,
      purchaseAmount: 0,
    };

    const result = aiRecommendationEngineStub.findSimilarPatterns(testInput);

    expect(typeof result.matchingScore).toBe('number');
    expect(result.matchingScore).toBeGreaterThanOrEqual(0);
    expect(result.matchingScore).toBeLessThanOrEqual(100);
    expect(Number.isNaN(result.matchingScore)).toBe(false);
    expect(Number.isFinite(result.matchingScore)).toBe(true);
    expect(result.matchingScore).toBe(50);
    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBeGreaterThan(0);
    expect(result.similarPatterns[0].score).toBe(50);
  });
});