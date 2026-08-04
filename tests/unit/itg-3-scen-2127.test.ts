import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への適用推奨', () => {
  // SCEN-2127
  test('過去商談データが null のとき、エラーが発生する', () => {
    const pastDealData = null;
    const newDealCondition = {
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      customerChallenges: ['cost_reduction', 'efficiency_improvement'],
    };

    expect(() =>
      generateRecommendation(pastDealData, newDealCondition)
    ).toThrow(/過去商談データが null|商談データが不正/);

    try {
      generateRecommendation(pastDealData, newDealCondition);
      fail('エラーが投げられるべき');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/過去商談データが null|商談データが不正/);

        const errorWithCode = error as Error & { statusCode?: number; errorCode?: number };
        const statusCode = errorWithCode.statusCode || errorWithCode.errorCode;

        if (statusCode !== undefined) {
          expect(statusCode).toBeGreaterThanOrEqual(400);
          expect(statusCode).toBeLessThan(500);
        }
      } else {
        fail('Error クラスのインスタンスではない');
      }
    }
  });
});