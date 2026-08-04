import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1863: 推奨根拠レコードが0件のときエラーハンドリングを検証', async () => {
    // セットアップ: 推奨根拠レコード0件のデータベース環境をシミュレート
    const recommendationId = 'REC-20260801-001';
    
    // スタブ: AIRecommendationEngineのexplainRecommendationReasoningメソッド
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        success: false,
        errorCode: 'REC_REASON_NOT_FOUND',
        reasoningRecords: []
      })
    };

    // 推奨根拠レコード取得ロジックのモック化
    const mockGetRecommendationReasons = jest.fn().mockResolvedValue({
      records: [],
      count: 0
    });

    // 根拠表示機能を実行
    const result = await explainRecommendationReasoning(
      recommendationId,
      mockAIRecommendationEngine,
      mockGetRecommendationReasons
    );

    // 期待結果の検証
    // (1) エラーコード『REC_REASON_NOT_FOUND』が返される
    expect(result.errorCode).toBe('REC_REASON_NOT_FOUND');

    // (2) ユーザー向けメッセージが表示対象として返される
    expect(result.userMessage).toBe('この推奨の根拠情報は現在利用できません');

    // (3) APIレスポンスのステータスコードは『404 Not Found』を返す
    expect(result.httpStatusCode).toBe(404);

    // (4) 推奨パターンマスタからの簡略版根拠説明は表示されない
    expect(result.fallbackSummary).toBeNull();

    // (5) 推奨根拠レコード取得が実行されたことを確認
    expect(mockGetRecommendationReasons).toHaveBeenCalledWith(recommendationId);

    // (6) 推奨根拠レコード取得が0件を返したことを確認
    expect(result.reasoningRecords).toEqual([]);
    expect(result.reasoningRecords.length).toBe(0);
  });
});