import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-918: [edge] 推奨根拠説明生成機能 - 根拠説明がAIエージェント失敗時に簡略版説明が代替提示される
  test('AIエージェント呼び出し失敗時に簡略版説明が代替提示される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API timeout exceeded')
      ),
    };

    const input = {
      customerId: 'CUST-12345',
      dealConditionId: 'DEAL-67890',
      recommendationPatternId: 'PATTERN-001',
      aiEngine: mockAIEngine,
    };

    const result = await explainRecommendationReasoning(input);

    expect(result).toHaveProperty('explanation');
    expect(result).toHaveProperty('isSimplified');
    expect(result).toHaveProperty('successRate');
    expect(result).toHaveProperty('applicationCount');

    expect(result.isSimplified).toBe(true);
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThan(0);
    expect(result.explanation.length).toBeLessThan(500);

    expect(typeof result.successRate).toBe('number');
    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(100);

    expect(typeof result.applicationCount).toBe('number');
    expect(result.applicationCount).toBeGreaterThanOrEqual(0);

    expect(result.explanation).not.toMatch(/営業戦略/);
    expect(result.explanation).not.toMatch(/カスタマイズ/);
    expect(result.explanation).toMatch(/成功率|適用実績|パターン/);
  });
});