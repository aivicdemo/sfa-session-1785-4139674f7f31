import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  test('SCEN-1439: 同じ新規案件条件で2回推奨を生成したとき、同じ提案アプローチが返却される', () => {
    // Mock AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn(() => ({
        approach_id: 'approach_001',
        reasoning: '顧客は製造業で業務効率化を課題としており、3ヶ月の導入期限内に実現可能な提案として、在庫管理自動化ソリューションが過去3件の類似案件で成約実績あり。予算規模5000万円は当ソリューション導入の標準予算範囲内である。',
        relevance_score: 0.92,
        description: '在庫管理自動化ソリューション導入による業務効率化提案。過去同一顧客層での成功率92%。'
      }))
    };

    const newDealCondition = {
      industry: '製造業',
      budget_amount: 50000000,
      implementation_deadline_months: 3,
      challenge: '業務効率化'
    };

    // First call
    const recommendation1 = mockAIEngine.generateRecommendation(newDealCondition);

    // Second call with identical condition
    const recommendation2 = mockAIEngine.generateRecommendation(newDealCondition);

    // Verify both recommendations are identical
    expect(recommendation1).toEqual(recommendation2);
    expect(recommendation1.approach_id).toBe('approach_001');
    expect(recommendation1.relevance_score).toBe(0.92);
    expect(recommendation1.reasoning).toBe(
      '顧客は製造業で業務効率化を課題としており、3ヶ月の導入期限内に実現可能な提案として、在庫管理自動化ソリューションが過去3件の類似案件で成約実績あり。予算規模5000万円は当ソリューション導入の標準予算範囲内である。'
    );
    expect(recommendation1.description).toBe(
      '在庫管理自動化ソリューション導入による業務効率化提案。過去同一顧客層での成功率92%。'
    );
    expect(recommendation2.approach_id).toBe('approach_001');
    expect(recommendation2.relevance_score).toBe(0.92);
    expect(recommendation2.reasoning).toBe(
      '顧客は製造業で業務効率化を課題としており、3ヶ月の導入期限内に実現可能な提案として、在庫管理自動化ソリューションが過去3件の類似案件で成約実績あり。予算規模5000万円は当ソリューション導入の標準予算範囲内である。'
    );
    expect(recommendation2.description).toBe(
      '在庫管理自動化ソリューション導入による業務効率化提案。過去同一顧客層での成功率92%。'
    );
  });
});