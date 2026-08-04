import { generateAndUploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2285
  test('推奨レポート生成・ファイル保存機能 - S3へのアップロードが最大再試行回数（2回）を超えて失敗したとき、処理を中断してエラーを返す', async () => {
    const recommendationData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      proposalContent: '新規システム導入による業務効率化',
      proposalApproach: 'フェーズ1: 要件定義、フェーズ2: システム設計',
      successPatternReason: '過去の類似案件で80%の成約率を達成した顧客属性と一致',
      confidenceScore: 85,
      generatedAt: new Date('2024-01-15T11:00:00Z'),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error('接続タイムアウト'))
        .mockRejectedValueOnce(new Error('アクセス拒否')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const startTime = Date.now();

    try {
      await generateAndUploadRecommendationReport(
        recommendationData,
        mockFileStorageAdapter
      );
      fail('例外がスローされるべきです');
    } catch (error) {
      const elapsedTime = Date.now() - startTime;

      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/S3アップロード失敗/);
      expect((error as Error).message).toMatch(/最大再試行回数.*2回.*超過/);
      expect((error as Error).message).toMatch(/アクセス拒否/);

      expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);
      expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          customerId: recommendationData.customerId,
          customerName: recommendationData.customerName,
          proposalContent: recommendationData.proposalContent,
        })
      );
      expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          customerId: recommendationData.customerId,
          customerName: recommendationData.customerName,
          proposalContent: recommendationData.proposalContent,
        })
      );

      expect(elapsedTime).toBeGreaterThanOrEqual(3000);
      expect(elapsedTime).toBeLessThan(5000);
    }
  });
});