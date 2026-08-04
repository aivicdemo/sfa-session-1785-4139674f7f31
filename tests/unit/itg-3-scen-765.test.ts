import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-765
  test('explainRecommendationReasoning が成功応答したとき、推奨根拠の説明文が返却される', async () => {
    const recommendationId = 'rec-12345';
    const customerId = 'cust-98765';
    const businessType = 'IT企業';
    const successRate = 70;
    const approachType = 'A';

    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        `顧客の業種が${businessType}であり、過去の成功事例では同業種への提案で${successRate}%の成約率を達成しており、提案アプローチ${approachType}が最適です。` +
        `本顧客の経営課題は設備投資の効率化であり、同様の課題を持つIT企業向けプロジェクトでは${approachType}アプローチが有効であることが実証されています。` +
        `リスク要因としては業界内の競争が激しい点が挙げられますが、タイミングを前四半期に設定することで対応可能です。`
      )
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerId,
      mockRecommendationEngine
    );

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(100);
    expect(result).toContain('IT企業');
    expect(result).toContain('70%');
    expect(result).toContain('提案アプローチA');
    expect(result).toContain('成功事例');
    expect(result).toContain('。');
  });
});