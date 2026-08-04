import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・保存', () => {
  // SCEN-742
  test('S3アップロード2回再試行後も失敗したときレポート生成エラーが返される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-20240115-001',
        proposalApproach: 'フォローアップ最適化による段階的提案',
        confidenceScore: 87,
        reasoning: [
          {
            factor: '購買シグナル検出',
            evidence: '過去30日間のWebサイト訪問回数が前月比150%に増加',
            weight: 0.35
          },
          {
            factor: '成功パターンマッチ',
            evidence: '類似顧客5社の成功事例との一致度85%',
            weight: 0.40
          },
          {
            factor: 'フォローアップタイミング',
            evidence: '最後の接触から21日経過（標準タイミング14-28日）',
            weight: 0.25
          }
        ],
        recommendedTiming: '2024-01-16',
        recommendedQuantity: 3,
        relatedSuccessPatterns: ['SP-2023-Q4-001', 'SP-2023-Q4-002']
      })
    };

    let uploadCallCount = 0;
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadCallCount++;
        if (uploadCallCount === 1) {
          throw new Error('ネットワークエラー: 接続タイムアウト');
        }
        if (uploadCallCount === 2) {
          throw new Error('タイムアウトエラー: サーバーが応答しません');
        }
        if (uploadCallCount === 3) {
          throw new Error('S3認証エラー: 認証情報が無効です');
        }
        return { url: 'https://example.s3.amazonaws.com/report.pdf' };
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: 'https://example.s3.amazonaws.com/report.pdf?expires=...',
        expiresAt: '2024-01-22T11:00:00Z'
      })
    };

    const inputCaseId = 'case-20240115-001';
    const inputCustomerInfo = {
      customerId: 'cust-12345',
      customerName: '株式会社テスト',
      industry: 'IT',
      scale: 'mid-market',
      currentChallenges: ['デジタル変革', 'コスト最適化']
    };
    const inputDealCondition = {
      dealId: 'deal-67890',
      dealStage: 'proposal',
      dealAmount: 5000000,
      decisionMaker: '情報システム部長',
      timeline: '2024-02-28'
    };

    let capturedHTMLFallback = null;

    try {
      const result = await generateRecommendationReportWithRetry(
        inputCaseId,
        inputCustomerInfo,
        inputDealCondition,
        mockAIEngine,
        mockFileStorage,
        (htmlContent) => {
          capturedHTMLFallback = htmlContent;
        }
      );
      fail('エラーがthrowされるべき');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe('REPORT_GENERATION_FAILED');
      expect(error.message).toBe(
        'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
      );
      expect(error.retryAttempts).toBe(2);
      expect(error.totalCalls).toBe(3);
    }

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        caseId: inputCaseId,
        recommendation: expect.objectContaining({
          recommendationId: 'rec-20240115-001',
          confidenceScore: 87
        })
      }),
      expect.any(String)
    );

    expect(capturedHTMLFallback).toBeTruthy();
    expect(capturedHTMLFallback).toContain('rec-20240115-001');
    expect(capturedHTMLFallback).toContain('87');
    expect(capturedHTMLFallback).toContain('フォローアップ最適化による段階的提案');
  });
});