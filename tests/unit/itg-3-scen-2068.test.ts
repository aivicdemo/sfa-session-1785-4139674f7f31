import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithS3Upload } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  let mockAIEngine: any;
  let mockFileStorage: any;
  let initialHistoryCount: number;

  beforeEach(() => {
    initialHistoryCount = 0;

    mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-20260801-001',
        customer_name: 'ABC Corporation',
        proposal_approach: 'クラウドマイグレーション戦略',
        reasoning_basis: '過去の類似案件（IT業界、500万円予算帯）での成功パターンと合致',
        confidence_score: 85,
      }),
    };

    mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_key: 'recommendations/REC-20260801-001.pdf',
        timestamp: new Date('2026-08-01T11:00:00Z').toISOString(),
        status: 'SUCCESS',
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2068
  test('推奨内容がAmazon S3へのアップロードに成功した場合、推奨履歴テーブルに記録される', async () => {
    const newDealInput = {
      customer_id: 'C001',
      industry: 'IT',
      budget_amount: 5000000,
      business_challenge: 'DX推進',
    };

    const result = await generateRecommendationWithS3Upload(
      newDealInput,
      mockAIEngine,
      mockFileStorage
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealInput);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendation_id: 'REC-20260801-001',
        customer_name: 'ABC Corporation',
        proposal_approach: 'クラウドマイグレーション戦略',
      })
    );
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    expect(result).toEqual(
      expect.objectContaining({
        recommendation_id: 'REC-20260801-001',
        deal_id: expect.any(String),
        s3_file_key: 'recommendations/REC-20260801-001.pdf',
        upload_status: 'SUCCESS',
        recorded_timestamp: new Date('2026-08-01T11:00:00Z').toISOString(),
        confidence_score: 85,
      })
    );

    expect(result.recommendation_id).toBe('REC-20260801-001');
    expect(result.s3_file_key).toBe('recommendations/REC-20260801-001.pdf');
    expect(result.upload_status).toBe('SUCCESS');
  });
});