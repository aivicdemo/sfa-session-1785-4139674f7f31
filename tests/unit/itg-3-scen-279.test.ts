import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-279
  test('OpenAI API失敗時に推奨パターンマスタから簡略版根拠説明を返却', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('OpenAI API connection failed')
      ),
    };

    const recommendationPatternMaster = {
      'P-001': '顧客業界が製造業で、過去成功事例との合致度が85%のため推奨',
    };

    const newCase = {
      patternId: 'P-001',
      customerIndustry: '製造業',
      companySize: '中堅',
      challenge: '生産効率化',
    };

    const result = await explainRecommendationReasoning(
      newCase,
      mockAIEngine,
      recommendationPatternMaster
    );

    expect(result).toBe('顧客業界が製造業で、過去成功事例との合致度が85%のため推奨');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});