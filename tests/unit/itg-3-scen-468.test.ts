import { generateRecommendationWithGuidance } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  test('SCEN-468: スコア85点（81～100点）の場合、「継続維持」が推奨される', () => {
    // Arrange: テストデータの準備
    const caseInfo = {
      caseId: 'CASE-20240115-001',
      score: 85,
      customerIndustry: 'IT',
      dealSize: 50000000,
      dealStage: 'proposal',
      salesPersonExperience: 5,
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedStrategy: '継続維持',
        confidenceScore: 92,
        reasoning: '現在のスコア水準（81～100点）を維持するため、既存の営業活動を継続することを推奨します',
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-001',
          matchScore: 0.88,
          successRate: 0.89,
        },
      ]),
    };

    // Act: 指導施策推奨機能を実行
    const result = generateRecommendationWithGuidance(caseInfo, mockAIRecommendationEngine);

    // Assert: 推奨施策フィールドが「継続維持」であることを確認
    expect(result.recommendedStrategy).toBe('継続維持');

    // Assert: 推奨根拠説明文が生成されていることを確認
    expect(result.reasoning).toBe('現在のスコア水準（81～100点）を維持するため、既存の営業活動を継続することを推奨します');

    // Assert: 信頼度スコアが0～100の範囲内であることを確認
    expect(result.confidenceScore).toBe(92);

    // Assert: AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(caseInfo);

    // Assert: 画面表示用のフォーマット情報が生成されていることを確認
    expect(result.displayFormat).toEqual({
      strategyLabel: '継続維持',
      reasoningText: '現在のスコア水準（81～100点）を維持するため、既存の営業活動を継続することを推奨します',
      scoreRangeMin: 81,
      scoreRangeMax: 100,
      currentScore: 85,
    });
  });
});