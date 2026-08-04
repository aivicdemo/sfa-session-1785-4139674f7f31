import { recordRecommendationResult } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨履歴管理機能', () => {
  test('SCEN-2494: 推奨結果を記録し、推奨履歴テーブルに1件追加される', async () => {
    const recommendation_id = 'REC-20250801-001';
    const customer_name = '顧客A';
    const recommendation_content = '顧客A向け提案アプローチ：カスタマイズ営業戦略';
    const recommendation_reason = '過去成功パターン類似度85%';
    const adoption_flag = true;
    const record_user_id = 'USER-001';
    const record_timestamp = new Date('2025-08-01T10:30:00Z');

    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: recommendation_id,
        recommendation_content: recommendation_content,
        recommendation_reason: recommendation_reason,
      }),
    };

    const deal_condition = {
      customer_name: customer_name,
      industry: '製造業',
      budget: 5000000,
      stage: '初期接触',
    };

    const result = await recordRecommendationResult(
      {
        recommendation_id: recommendation_id,
        customer_name: customer_name,
        recommendation_content: recommendation_content,
        recommendation_reason: recommendation_reason,
        adoption_flag: adoption_flag,
        record_user_id: record_user_id,
        record_timestamp: record_timestamp,
      },
      mockAiEngine
    );

    expect(result).toEqual({
      recommendation_id: recommendation_id,
      customer_name: customer_name,
      recommendation_content: recommendation_content,
      recommendation_reason: recommendation_reason,
      adoption_result: '採用',
      result_recorded_timestamp: record_timestamp,
      record_user_id: record_user_id,
      history_record_count: 1,
    });
  });
});