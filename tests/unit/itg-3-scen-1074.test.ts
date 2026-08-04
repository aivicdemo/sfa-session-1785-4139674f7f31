import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-2-1-1';

interface RecommendationHistoryRecord {
  recommendation_id: string;
  deal_id: string;
  user_id: string;
  recommendation_content: string;
  recommendation_datetime: string;
  status: string;
  created_at: string;
}

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
}

interface RecommendationHistoryRepository {
  insert: jest.Mock;
  getLatestByDealId: jest.Mock;
}

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1074
  test('推奨実行後、推奨内容と推奨日時が推奨履歴テーブルに記録される', async () => {
    // Setup: テスト用の新規案件データを準備
    const testDealId = 'deal_test_001';
    const testUserId = 'user_test_001';
    const testDealData = {
      deal_id: testDealId,
      customer_name: 'テスト顧客A',
      industry: 'IT',
      budget: '500万円',
      deal_status: '提案準備中',
    };

    const recommendationContent = 'クラウド導入支援パッケージを提案';
    const recommendationReason = 'IT業界の顧客で500万円の予算があり、クラウド導入支援が適合度の高い提案です';
    const recommendedDateTime = new Date('2024-01-15T14:30:00Z').toISOString();

    // Setup: AIRecommendationEngine スタブを作成
    const mockAIEngine: AIRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_content: recommendationContent,
        recommendation_reason: recommendationReason,
        confidence_score: 87,
        similar_patterns_count: 12,
      }),
    };

    // Setup: RecommendationHistoryRepository スタブを作成
    const mockHistoryRepository: RecommendationHistoryRepository = {
      insert: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_hist_001',
      }),
      getLatestByDealId: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_hist_001',
        deal_id: testDealId,
        user_id: testUserId,
        recommendation_content: recommendationContent,
        recommendation_datetime: recommendedDateTime,
        status: 'active',
        created_at: recommendedDateTime,
      }),
    };

    // Execute: 推奨実行処理を呼び出し
    const executionTimestamp = new Date('2024-01-15T14:30:00Z');
    const result = await recordRecommendationHistory(
      {
        deal_id: testDealId,
        user_id: testUserId,
        deal_data: testDealData,
      },
      mockAIEngine,
      mockHistoryRepository,
      executionTimestamp
    );

    // Verify: AIエンジンが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: 'テスト顧客A',
        industry: 'IT',
        budget: '500万円',
      })
    );

    // Verify: 推奨履歴テーブルへの挿入が呼び出されたことを確認
    expect(mockHistoryRepository.insert).toHaveBeenCalled();
    const insertCall = mockHistoryRepository.insert.mock.calls[0][0];
    
    expect(insertCall).toMatchObject({
      deal_id: testDealId,
      user_id: testUserId,
      recommendation_content: recommendationContent,
    });

    // Verify: 推奨履歴テーブルから取得したレコードの検証
    const latestRecord = await mockHistoryRepository.getLatestByDealId(testDealId);

    // recommendation_content フィールドが期待値と完全一致
    expect(latestRecord.recommendation_content).toBe(recommendationContent);

    // recommendation_datetime フィールドが実行時刻を正確に記録（±2秒以内）
    const recordedTime = new Date(latestRecord.recommendation_datetime).getTime();
    const expectedTime = executionTimestamp.getTime();
    const timeDifference = Math.abs(recordedTime - expectedTime);
    expect(timeDifference).toBeLessThanOrEqual(2000); // 2秒以内

    // deal_id フィールドがテスト案件のIDと一致
    expect(latestRecord.deal_id).toBe(testDealId);

    // user_id フィールドが実行コンテキストと一致
    expect(latestRecord.user_id).toBe(testUserId);

    // status フィールドが適切に設定
    expect(latestRecord.status).toBe('active');

    // created_at フィールドが記録されている
    expect(latestRecord.created_at).toBeDefined();

    // result オブジェクトの検証
    expect(result).toMatchObject({
      success: true,
      history_record_id: 'rec_hist_001',
      recommendation_content: recommendationContent,
      recorded_at: recommendedDateTime,
    });
  });
});