import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1176
  test('レポート生成・保存機能 - S3アップロード失敗時の1回目再試行で失敗し2回目再試行（10秒後）で成功したとき、正常なダウンロードURLを返却する', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    let uploadAttemptCount = 0;

    mockFileStorageAdapter.uploadRecommendationReport.mockImplementation(
      () => {
        uploadAttemptCount += 1;
        if (uploadAttemptCount === 1) {
          return Promise.reject(new Error('S3接続エラー'));
        }
        if (uploadAttemptCount === 2) {
          return Promise.reject(new Error('ネットワークタイムアウト'));
        }
        if (uploadAttemptCount === 3) {
          return Promise.resolve({
            status: 200,
            s3_object_key: 'recommendations/2026-01-15/report-12345.pdf',
            metadata: {
              bucket: 'sales-reports-prod',
              region: 'ap-northeast-1',
              uploaded_at: '2026-01-15T14:30:00Z',
            },
          });
        }
      }
    );

    mockFileStorageAdapter.generateDownloadUrl.mockResolvedValue({
      download_url:
        'https://sales-reports-prod.s3.ap-northeast-1.amazonaws.com/recommendations/2026-01-15/report-12345.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20260115%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260115T143000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123def456',
      expires_at: '2026-01-15T15:30:00Z',
      expires_in_seconds: 3600,
    });

    const recommendationPayload = {
      recommendation_id: 'rec-2026-01-15-001',
      customer_id: 'cust-12345',
      deal_id: 'deal-67890',
      recommendation_content: {
        title: '提案アプローチ推奨',
        description: '過去の成功案件から抽出した提案内容',
        approach: 'consultative_sales',
        suggested_timing: '2026-01-20',
      },
      reasoning_basis: {
        similar_patterns_count: 5,
        success_rate: 0.85,
        key_factors: ['顧客業種: SaaS企業', '予算規模: 5M-10M円', 'リード時間: 2-3ヶ月'],
      },
      confidence_score: 87,
      generated_at: '2026-01-15T14:25:00Z',
    };

    const result = await generateRecommendationReport(
      recommendationPayload,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      'recommendations/2026-01-15/report-12345.pdf'
    );

    expect(result).toEqual({
      status: 'success',
      download_url:
        'https://sales-reports-prod.s3.ap-northeast-1.amazonaws.com/recommendations/2026-01-15/report-12345.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20260115%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260115T143000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123def456',
      expires_at: '2026-01-15T15:30:00Z',
      expires_in_seconds: 3600,
      report_id: 'rec-2026-01-15-001',
      s3_object_key: 'recommendations/2026-01-15/report-12345.pdf',
    });
  });
});