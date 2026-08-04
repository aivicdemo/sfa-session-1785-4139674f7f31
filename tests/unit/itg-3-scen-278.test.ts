import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-278
  test('推奨根拠の自然言語説明生成機能 - OpenAI APIが正常応答したとき、営業担当者向けの根拠説明文が生成される', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          explanation: '同業の製造業で類似の提案ステージで成約した事例3件の成功パターンに基づいて、このご提案アプローチを推奨いたします。顧客の経営課題パターンと過去成功事例のマッチ度が85%であることから、提案内容の実装可能性が高いと判定されています。フォローアップのタイミングは商談から3営業日以内に実施することで、顧客の検討温度が最も高い状態での対応が効果的です。以上の分析結果に基づき、本アプローチの実行をお勧めいたします。'
        }
      })
    };

    const recommendationData = {
      recommendationId: 'REC-2024-001',
      customerIndustry: '製造業',
      dealStage: '提案前',
      successPatternMatchScore: 85,
      similarSuccessExamplesCount: 3,
      followUpDaysFromDealStart: 3
    };

    const result = await explainRecommendationReasoning(
      recommendationData,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'REC-2024-001',
        customerIndustry: '製造業',
        dealStage: '提案前',
        successPatternMatchScore: 85
      })
    );

    expect(result).toBeDefined();
    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThanOrEqual(250);
    expect(result.explanation.length).toBeLessThanOrEqual(400);
    expect(result.explanation).toMatch(/同業の製造業/);
    expect(result.explanation).toMatch(/成約した事例3件/);
    expect(result.explanation).toMatch(/85%/);
    expect(result.explanation).toMatch(/提案アプローチを推奨/);
    expect(result.explanation).toMatch(/フォローアップ/);
    expect(result.explanation).toMatch(/3営業日/);
    expect(result.explanation).toMatch(/いたします/);
  });
});