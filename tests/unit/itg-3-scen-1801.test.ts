import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - AIエージェント呼び出し成功時', () => {
  // SCEN-1801
  test('OpenAI APIから返却された提案アプローチが使用される', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の経営課題に対する段階的なコンサルティングアプローチ',
        reasoning: '過去5件の類似案件で80%の成約率を達成',
        similarPatterns: [
          {
            caseId: 'CASE-001',
            matchScore: 0.95,
            industryType: '製造業',
            challengePattern: 'DX推進',
            budgetRange: '5000万円',
            contractedAmount: '5200万円',
          },
          {
            caseId: 'CASE-002',
            matchScore: 0.88,
            industryType: '製造業',
            challengePattern: 'DX推進',
            budgetRange: '4800万円',
            contractedAmount: '4950万円',
          },
        ],
        relevanceScore: 0.92,
      }),
    };

    const newDealCondition = {
      industryType: '製造業',
      challenge: 'DX推進',
      budgetScale: '5000万円',
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockRecommendationEngine
    );

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealCondition
    );

    expect(result.proposalApproach).toBe(
      '顧客の経営課題に対する段階的なコンサルティングアプローチ'
    );
    expect(result.reasoning).toBe(
      '過去5件の類似案件で80%の成約率を達成'
    );
    expect(result.relevanceScore).toBe(0.92);

    const displayText = `提案アプローチ: ${result.proposalApproach}（信頼度: ${Math.round(result.relevanceScore * 100)}%）`;
    expect(displayText).toBe(
      '提案アプローチ: 顧客の経営課題に対する段階的なコンサルティングアプローチ（信頼度: 92%）'
    );

    expect(result.similarPatterns).toHaveLength(2);
    expect(result.similarPatterns[0].caseId).toBe('CASE-001');
    expect(result.similarPatterns[0].matchScore).toBe(0.95);
    expect(result.similarPatterns[1].caseId).toBe('CASE-002');
    expect(result.similarPatterns[1].matchScore).toBe(0.88);
  });
});