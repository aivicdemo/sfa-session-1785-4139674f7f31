import { explainRecommendationReasoning, generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1619
  test('AIエージェント外部連携が正常応答したとき、推奨内容の根拠が営業担当者向けに自然言語で説明される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: '初期ヒアリング後1週間以内に詳細提案を実施',
        relevanceScore: 0.92,
        similarPatterns: [
          {
            caseId: 'case-001',
            customerSize: 'large',
            industry: 'SaaS',
            budgetRange: '5000000',
            decisionPeriodDays: 90,
          },
          {
            caseId: 'case-002',
            customerSize: 'large',
            industry: 'SaaS',
            budgetRange: '5000000',
            decisionPeriodDays: 90,
          },
          {
            caseId: 'case-003',
            customerSize: 'large',
            industry: 'SaaS',
            budgetRange: '5000000',
            decisionPeriodDays: 90,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'この顧客は過去3件の類似案件（SaaS導入、予算規模500万円以上、決定期間3ヶ月）すべてで、初期ヒアリング後1週間以内に詳細提案を実施した企業で成約しています。本案件も同じ顧客規模・業種のため、同じアプローチを推奨します。'
      ),
    };

    const newCaseInput = {
      customerName: 'Example Corp',
      industry: 'SaaS',
      customerSize: 'large',
      budgetRange: '5000000',
      decisionPeriodDays: 90,
    };

    const recommendationResult = await generateRecommendation(
      newCaseInput,
      mockAIEngine
    );

    const explanation = await explainRecommendationReasoning(
      recommendationResult,
      mockAIEngine
    );

    expect(explanation).toBeDefined();
    expect(typeof explanation).toBe('string');
    expect(explanation.length).toBeGreaterThanOrEqual(50);
    expect(explanation).toContain('3件');
    expect(explanation).toContain('SaaS');
    expect(explanation).toContain('500万円');
    expect(explanation).toContain('1週間');
    expect(explanation).toMatch(/\S+/);
    const sentenceCount = (explanation.match(/[。]/g) || []).length;
    expect(sentenceCount).toBeGreaterThanOrEqual(1);
    expect(sentenceCount).toBeLessThanOrEqual(5);
  });
});