import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1446
  test('AI推奨エンジンの根拠説明生成が正常応答したとき、自然言語説明が表示される', async () => {
    const recommendationId = 'rec-20240115-001';
    const proposalApproach = 'システム課題のROI試算と段階的導入プラン';
    const patternMatchScore = 95;
    const recommendationInput = {
      recommendationId,
      proposalApproach,
      patternMatchScore,
      customerIndustry: '製造業',
      customerEmployeeCount: 750,
      pastSuccessPatternId: 'pattern-dx-manufacturing-500-1000',
    };

    const mockAiEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        status: 200,
        explanation:
          'この顧客は過去の成功事例「同業種・従業員数500～1000名の製造業向けDX提案」と95%マッチしています。提案アプローチとしては、既存システムの課題ヒアリング→ROI試算→段階的導入プランの順序で提示することで、成約率が78%に達しています',
      }),
    };

    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAiEngine
    );

    expect(mockAiEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );
    expect(result.status).toBe(200);
    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThanOrEqual(20);
    expect(result.explanation).toMatch(/過去の成功事例/);
    expect(result.explanation).toMatch(/95%マッチ/);
    expect(result.explanation).toMatch(/成約率/);
    expect(result.explanation).toMatch(/提案アプローチ/);
    expect(result.explanation).toMatch(/製造業/);
    expect(result.explanation).toContain('課題ヒアリング');
    expect(result.explanation).toContain('ROI試算');
    expect(result.explanation).toContain('段階的導入プラン');
  });
});