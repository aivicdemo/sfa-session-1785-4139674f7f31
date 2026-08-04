import { generateRecommendation } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  // SCEN-468: [normal] スコアが最高水準（81～100点）の場合、「継続維持」が推奨される
  test('スコア85点（最高水準）の案件に対して「継続維持」推奨と根拠説明を返す', () => {
    const mock_AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedStrategy: '継続維持',
        confidenceScore: 92,
        reasoningExplanation: '現在のスコア水準（81～100点）を維持するため、既存の営業活動を継続することを推奨します。',
      }),
    };

    const input_caseData = {
      caseId: 'CASE-001',
      customerName: 'テスト顧客A',
      performanceScore: 85,
      industry: 'IT',
      dealStage: 'proposal',
      salesApproach: '既存営業活動',
    };

    return generateRecommendation(
      input_caseData,
      mock_AIRecommendationEngine,
    ).then((result) => {
      expect(result.recommendedStrategy).toBe('継続維持');
      expect(result.confidenceScore).toBe(92);
      expect(result.reasoningExplanation).toContain('現在のスコア水準（81～100点）を維持するため');
      expect(result.reasoningExplanation).toContain('既存の営業活動を継続することを推奨します');

      expect(mock_AIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
        input_caseData,
      );
    });
  });
});