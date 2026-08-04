import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1919
  test('推奨根拠の可視化機能 - 根拠データに重複が含まれるときに重複が保持される', () => {
    const mock_recommendation_id = 'rec-12345';
    const mock_reasons_with_duplicates = [
      { id: 'reason-1', text: '過去成功パターンA', weight: 0.8 },
      { id: 'reason-2', text: '顧客業界の成長トレンド', weight: 0.6 },
      { id: 'reason-1', text: '過去成功パターンA', weight: 0.8 }
    ];

    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendation_id: mock_recommendation_id,
        reasons: mock_reasons_with_duplicates
      })
    };

    const actual_result = explainRecommendationReasoning(
      mock_recommendation_id,
      mock_ai_engine
    );

    return actual_result.then((result) => {
      expect(result.reasons).toHaveLength(3);
      expect(result.reasons[0]).toEqual({
        id: 'reason-1',
        text: '過去成功パターンA',
        weight: 0.8
      });
      expect(result.reasons[1]).toEqual({
        id: 'reason-2',
        text: '顧客業界の成長トレンド',
        weight: 0.6
      });
      expect(result.reasons[2]).toEqual({
        id: 'reason-1',
        text: '過去成功パターンA',
        weight: 0.8
      });
      expect(result.reasons[0]).toEqual(result.reasons[2]);
    });
  });
});