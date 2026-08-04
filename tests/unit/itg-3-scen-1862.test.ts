import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1862
  test('推奨内容が空文字列のとき根拠表示に失敗する', () => {
    const recommendationWithEmptyContent = {
      recommendation: '',
      reasoning: '根拠テキスト',
      patterns: [
        {
          patternId: 'PAT001',
          patternName: '成功パターンA',
          matchScore: 0.85
        }
      ]
    };

    const result = explainRecommendationReasoning(recommendationWithEmptyContent);

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('EMPTY_RECOMMENDATION_CONTENT');
    expect(result.errorMessage).toBe('推奨内容が空のため根拠を生成できません');
  });
});