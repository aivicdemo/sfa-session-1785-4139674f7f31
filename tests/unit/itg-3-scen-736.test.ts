import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-736
  test('[error] 推奨根拠の可視化と説明生成機能 - explainRecommendationReasoningの外部API呼び出しが失敗したとき簡略版根拠説明が返却される', async () => {
    const mock_engine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable')),
    };

    const mock_pattern_master = {
      get: jest.fn((recommendation_id: string) => {
        if (recommendation_id === 'rec_12345') {
          return {
            recommendation_id: 'rec_12345',
            pattern_name: 'Early Stage Follow-up Pattern',
            brief_reason: '初期段階フォローアップで成功率高い',
            detailed_reason: '詳細な説明は省略',
            success_rate: 78,
          };
        }
        return null;
      }),
    };

    const recommendation_id = 'rec_12345';
    const verbose_option = true;

    const result = await explainRecommendationReasoning(
      recommendation_id,
      { verbose: verbose_option },
      mock_engine,
      mock_pattern_master
    );

    expect(mock_engine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      recommendation_id: 'rec_12345',
      pattern_name: 'Early Stage Follow-up Pattern',
      brief_reason: '初期段階フォローアップで成功率高い',
      success_rate: 78,
    });
    expect(result).not.toHaveProperty('detailed_reason');
  });
});