import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-160
  test('推奨根拠説明文生成機能 - AIエージェント正常応答時に自然言語の説明文が生成される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '顧客の業界は製造業で、過去の成功事例では同業界向けの提案で成約率が78%でした。貴社の提案では、導入後の運用支援体制を強調することで、類似案件での成功パターンと合致する可能性が高いと判断されます',
      }),
    };

    const recommendationId = 'REC-20240115-001';
    const customerId = 'CUST-20240115-101';
    const businessIndustry = '製造業';
    const successRate = 78;
    const proposalFocus = '運用支援体制';

    const result = await explainRecommendationReasoning(
      {
        recommendationId,
        customerId,
        businessIndustry,
        successRate,
        proposalFocus,
      },
      mockAIEngine
    );

    expect(result.explanation).toContain('顧客の業界は製造業で');
    expect(result.explanation).toContain('成約率が78%');
    expect(result.explanation).toContain('導入後の運用支援体制を強調');
    expect(result.explanation).toContain('類似案件での成功パターンと合致する可能性が高い');
    expect(result.explanation).toMatch(/\d+%/);
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThan(50);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith({
      recommendationId,
      customerId,
      businessIndustry,
      successRate,
      proposalFocus,
    });
  });
});