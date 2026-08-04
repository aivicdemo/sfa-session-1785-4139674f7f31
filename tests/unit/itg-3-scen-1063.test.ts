import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1063
  test('OpenAI API正常応答時に過去成功パターンと適用根拠を含む説明文が生成される', async () => {
    const mockRecommendationId = 'REC-20250115-001';
    const mockDealContext = {
      customerIndustry: '製造業',
      dealValue: 5000000,
      implementationMonths: 6,
    };

    const mockOpenAIResponse = {
      reasoning:
        '顧客のIT予算制約と導入スケジュール要件から判断すると、段階的導入アプローチが最適です。過去の類似案件（成功率87%）では、フェーズ1で基幹システム、フェーズ2で周辺システムの順序で提案した場合の契約率が92%に達しています。推奨アクション：来週の顧客マッチングで段階的なフェーズ分割案を提示し、初期投資額の低さと長期的な機能追加の柔軟性を強調してください。',
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(mockOpenAIResponse.reasoning),
    };

    const result = await explainRecommendationReasoning(
      mockRecommendationId,
      mockDealContext,
      mockAIRecommendationEngine
    );

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(250);
    expect(result).toMatch(/成功率|契約率|成功パターン/);
    expect(result).toMatch(/製造業|予算|導入/);
    expect(result).toMatch(/フェーズ|段階|推奨|提示/);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      mockRecommendationId,
      mockDealContext
    );
  });
});