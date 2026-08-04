import { saveRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 推奨履歴保存機能', () => {
  test('SCEN-111: [error] ユーザーIDが空のとき保存が拒否される', () => {
    const invalid_user_id = '';
    const recommendation_id = 'REC-20250115-001';
    const recommendation_content = '提案アプローチ：顧客の業種別ニーズに基づいた段階的提案';
    const pattern_relevance_score = 0.85;

    expect(() =>
      saveRecommendationHistory({
        userId: invalid_user_id,
        recommendationId: recommendation_id,
        recommendationContent: recommendation_content,
        patternRelevanceScore: pattern_relevance_score,
      })
    ).toThrow(/ユーザーID/);
  });
});