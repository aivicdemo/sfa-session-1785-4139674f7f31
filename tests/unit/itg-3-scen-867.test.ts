import { calculateTrustScore } from '../../src/logic/it-1-br-3-3-2-1';
import { AIRecommendationEngine } from '../../src/external/AIRecommendationEngine';

jest.mock('../../src/external/AIRecommendationEngine');

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-867: 商談条件の適用可能性スコアが入力されないとき信頼度スコア計算が成立しない', () => {
    // ARRANGE
    const customerId = 'CUST-001';
    const dealContent = '新規SaaS導入案件';
    const budgetCondition = '月額50万円以下';

    const mockAIEngine = AIRecommendationEngine as jest.MockedClass<typeof AIRecommendationEngine>;
    mockAIEngine.prototype.evaluatePatternRelevance = jest.fn().mockReturnValue({
      applicabilityScore: null,
      matchedPatterns: [],
    });

    // ACT
    const result = calculateTrustScore({
      customerId,
      dealContent,
      budgetCondition,
      aiRecommendationEngine: mockAIEngine.prototype,
    });

    // ASSERT
    expect(result.status).toBe('ERROR');
    expect(result.errorCode).toBe('MISSING_APPLICABILITY_SCORE');
    expect(result.errorMessage).toBe('商談条件の適用可能性スコアが取得できないため、信頼度スコアを計算できません');
    expect(result.trustScore).toBeNull();
    expect(result.internalLog).toMatch(/適用可能性スコアが入力されなかったため計算スキップ/);
  });
});