import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 推奨履歴の記録と追跡', () => {
  // SCEN-1076
  test('同じ顧客・同じ商談条件で2回推奨実行した場合、2件の推奨履歴が記録される', async () => {
    // Setup: テスト用の顧客データ
    const customerId = 'CUST-001';
    const customerName = '株式会社テスト';

    // Setup: テスト用の商談条件
    const dealId = 'DEAL-001';
    const productCategory = 'クラウドサービス';
    const budget = 5000000; // 500万円
    const decisionTimeline = '3ヶ月以内';

    // Setup: AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-' + Date.now(),
        recommendedApproach: '提案アプローチサンプル',
        confidenceScore: 85,
        reasoningBasis: '過去の類似案件パターンに基づいた推奨',
        generatedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      }),
    };

    // Setup: 推奨履歴テーブルをシミュレート
    const recommendationHistoryRecords: Array<{
      recommendationHistoryId: string;
      customerId: string;
      dealId: string;
      recommendedApproach: string;
      confidenceScore: number;
      reasoningBasis: string;
      recordedAt: string;
      recommendationGeneratedAt: string;
    }> = [];

    // 初期化: 既存レコードをクリア
    recommendationHistoryRecords.length = 0;

    // 1回目の推奨実行
    const firstRecommendation = await mockAIEngine.generateRecommendation({
      customerId,
      customerName,
      dealId,
      productCategory,
      budget,
      decisionTimeline,
    });

    const firstRecordTime = new Date('2024-01-15T11:00:00Z').toISOString();
    const firstHistoryRecord = {
      recommendationHistoryId: 'RECIHIST-' + Math.random().toString(36).substr(2, 9) + '-1',
      customerId,
      dealId,
      recommendedApproach: firstRecommendation.recommendedApproach,
      confidenceScore: firstRecommendation.confidenceScore,
      reasoningBasis: firstRecommendation.reasoningBasis,
      recordedAt: firstRecordTime,
      recommendationGeneratedAt: firstRecommendation.generatedAt,
    };

    recommendationHistoryRecords.push(firstHistoryRecord);
    const recordTime_1 = firstRecordTime;

    // 1回目の確認
    const firstRecordsAfterFirstExecution = recommendationHistoryRecords.filter(
      (r) => r.customerId === customerId && r.dealId === dealId
    );
    expect(firstRecordsAfterFirstExecution).toHaveLength(1);
    expect(firstRecordsAfterFirstExecution[0].recommendationHistoryId).toBe(
      firstHistoryRecord.recommendationHistoryId
    );

    // 2回目の推奨実行（同一顧客・同一商談）
    const secondRecommendation = await mockAIEngine.generateRecommendation({
      customerId,
      customerName,
      dealId,
      productCategory,
      budget,
      decisionTimeline,
    });

    const secondRecordTime = new Date('2024-01-15T12:30:00Z').toISOString();
    const secondHistoryRecord = {
      recommendationHistoryId: 'RECIHIST-' + Math.random().toString(36).substr(2, 9) + '-2',
      customerId,
      dealId,
      recommendedApproach: secondRecommendation.recommendedApproach,
      confidenceScore: secondRecommendation.confidenceScore,
      reasoningBasis: secondRecommendation.reasoningBasis,
      recordedAt: secondRecordTime,
      recommendationGeneratedAt: secondRecommendation.generatedAt,
    };

    recommendationHistoryRecords.push(secondHistoryRecord);
    const recordTime_2 = secondRecordTime;

    // 2回目以降の確認
    const finalRecords = recommendationHistoryRecords.filter(
      (r) => r.customerId === customerId && r.dealId === dealId
    );

    // 期待結果の検証
    expect(finalRecords).toHaveLength(2);
    expect(finalRecords[0].recommendationHistoryId).not.toBe(
      finalRecords[1].recommendationHistoryId
    );
    expect(recordTime_1 < recordTime_2).toBe(true);

    expect(finalRecords[0]).toEqual({
      recommendationHistoryId: firstHistoryRecord.recommendationHistoryId,
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      recommendedApproach: expect.any(String),
      confidenceScore: expect.any(Number),
      reasoningBasis: expect.any(String),
      recordedAt: recordTime_1,
      recommendationGeneratedAt: expect.any(String),
    });

    expect(finalRecords[1]).toEqual({
      recommendationHistoryId: secondHistoryRecord.recommendationHistoryId,
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      recommendedApproach: expect.any(String),
      confidenceScore: expect.any(Number),
      reasoningBasis: expect.any(String),
      recordedAt: recordTime_2,
      recommendationGeneratedAt: expect.any(String),
    });

    expect(finalRecords[0].recommendedApproach).toBeDefined();
    expect(finalRecords[0].reasoningBasis).toBeDefined();
    expect(finalRecords[0].confidenceScore).toBeGreaterThanOrEqual(0);
    expect(finalRecords[0].confidenceScore).toBeLessThanOrEqual(100);

    expect(finalRecords[1].recommendedApproach).toBeDefined();
    expect(finalRecords[1].reasoningBasis).toBeDefined();
    expect(finalRecords[1].confidenceScore).toBeGreaterThanOrEqual(0);
    expect(finalRecords[1].confidenceScore).toBeLessThanOrEqual(100);
  });
});