import { generateRecommendationWithConfidence } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-802: 推奨内容と根拠の統合提示機能 - 信頼度スコアが推奨内容オブジェクトに含まれて返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の経営課題に基づいた提案',
        reasoningExplanation: '過去の類似案件で成功した提案パターンを適用',
        relatedPastCases: [
          {
            caseId: 'CASE-001',
            customerIndustry: '製造業',
            dealAmount: 5000000,
            successResult: true,
          },
          {
            caseId: 'CASE-002',
            customerIndustry: '製造業',
            dealAmount: 4800000,
            successResult: true,
          },
        ],
        confidenceScore: 0.87,
      }),
    };

    const testDealInput = {
      customerId: 'CUST-12345',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySize: 'large',
      dealStage: 'proposal_preparation',
      dealValue: 5200000,
      dealTimeline: '2024-Q2',
    };

    const result = await generateRecommendationWithConfidence(
      testDealInput,
      mockAIEngine
    );

    expect(result).toHaveProperty('confidenceScore');
    expect(typeof result.confidenceScore).toBe('number');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);
    expect(result.confidenceScore).toBe(0.87);

    expect(result).toHaveProperty('proposalApproach');
    expect(result).toHaveProperty('reasoningExplanation');
    expect(result).toHaveProperty('relatedPastCases');

    expect(Array.isArray(result.relatedPastCases)).toBe(true);
    expect(result.relatedPastCases.length).toBeGreaterThan(0);

    const confidenceScoreString = result.confidenceScore.toString();
    const decimalPart = confidenceScoreString.split('.')[1];
    expect(decimalPart?.length).toBeLessThanOrEqual(2);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      testDealInput
    );
  });
});