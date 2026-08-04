import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI Recommendation Engine - generateRecommendation', () => {
  // SCEN-2908
  test('should return recommendation with approach strategy, reasoning, and confidence score when OpenAI API responds successfully', async () => {
    const mockEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachStrategy: '顧客課題に対する具体的な提案アプローチテキスト',
        reasoning: '過去成功パターンに基づいた根拠説明テキスト',
        confidenceScore: 0.85
      })
    };

    const customerInfo = {
      industry: 'manufacturing',
      challenge: 'supply chain optimization',
      budget: 5000000,
      companySize: 'large'
    };

    const dealCondition = {
      dealStage: 'initial_contact',
      expectedClosureDate: '2026-03-31',
      productCategory: 'ERP system'
    };

    const result = await generateRecommendation(
      customerInfo,
      dealCondition,
      mockEngine
    );

    expect(result.approachStrategy).toBe('顧客課題に対する具体的な提案アプローチテキスト');
    expect(result.reasoning).toBe('過去成功パターンに基づいた根拠説明テキスト');
    expect(result.confidenceScore).toBe(0.85);
    expect(result.approachStrategy).not.toBe('');
    expect(result.reasoning).not.toBe('');
    expect(typeof result.confidenceScore).toBe('number');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);
  });
});