import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨内容の根拠表示機能', () => {
  test('SCEN-1872: 参照する推奨根拠が0件のとき根拠表示に失敗する', () => {
    // Arrange: AIRecommendationEngineをスタブ化し、推奨根拠が0件の空配列を返すよう設定
    const recommendation_id = 'REC-12345';
    const emptyReasoningList = [];

    // Act: explainRecommendationReasoningメソッドを呼び出し
    const result = explainRecommendationReasoning(
      recommendation_id,
      emptyReasoningList
    );

    // Assert: エラーハンドリングが実行されたことを検証
    expect(result).toEqual({
      success: false,
      error_message: '推奨の根拠情報が見つかりません。別の推奨をお試しください',
      recommendation_id: recommendation_id,
      reasoning_list: [],
      error_log: `RecommendationReasoning: Empty reasoning list returned for recommendation ID ${recommendation_id}`
    });
    expect(result.reasoning_list).toHaveLength(0);
    expect(result.error_message).toMatch(/根拠情報が見つかりません/);
    expect(result.error_log).toMatch(/Empty reasoning list/);
  });
});