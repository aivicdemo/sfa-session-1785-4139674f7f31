import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

// Mock types
interface MockRecommendation {
  id: string;
  approach: string;
  confidence: number;
}

interface MockDealData {
  dealId: string;
  customerId: string;
  salesPersonName: string;
  customerName: string;
  industry: string;
}

interface MockReportContent {
  header: {
    generatedAt: string;
    dealId: string;
    salesPersonName: string;
  };
  recommendationSection: MockRecommendation[];
  footer: {
    pageCount: number;
    disclaimer: string;
  };
}

interface MockUploadResult {
  downloadUrl: string;
  expiresAt: string;
}

describe('AIエージェント推奨根拠の可視化 - レポート生成機能', () => {
  // SCEN-306
  test('推奨内容が0件のとき、空のレポートが生成される', async () => {
    // Arrange: モック設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.example.com/reports/deal-12345-20260115-abc123.pdf',
        expiresAt: '2026-01-16T11:00:00Z'
      } as MockUploadResult),
      generateDownloadUrl: jest.fn().mockResolvedValue('https://s3.example.com/reports/deal-12345-20260115-abc123.pdf'),
      deleteExpiredReports: jest.fn().mockResolvedValue(true)
    };

    const dealData: MockDealData = {
      dealId: 'DEAL-12345',
      customerId: 'CUST-98765',
      salesPersonName: '営業太郎',
      customerName: 'テスト株式会社',
      industry: '製造業'
    };

    const fixedGeneratedAt = '2026-01-15T11:00:00Z';

    // Act: テスト対象関数を実行
    const result = await generateRecommendationReport(
      dealData,
      mockAIEngine,
      mockFileStorage,
      new Date(fixedGeneratedAt)
    );

    // Assert: AIRecommendationEngineが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    // Assert: uploadRecommendationReportが呼び出されたことを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalled();

    // Assert: uploadRecommendationReportに渡されたレポート内容を検証
    const uploadCall = mockFileStorage.uploadRecommendationReport.mock.calls[0];
    const reportContent: MockReportContent = uploadCall[0];

    // ヘッダーが正常に含まれていることを確認
    expect(reportContent.header).toBeDefined();
    expect(reportContent.header.generatedAt).toBe('2026-01-15 11:00:00');
    expect(reportContent.header.dealId).toBe('DEAL-12345');
    expect(reportContent.header.salesPersonName).toBe('営業太郎');

    // 推奨内容セクションが空であることを確認
    expect(reportContent.recommendationSection).toEqual([]);
    expect(reportContent.recommendationSection.length).toBe(0);

    // フッターが正常に含まれていることを確認
    expect(reportContent.footer).toBeDefined();
    expect(reportContent.footer.disclaimer).toBeDefined();

    // S3アップロードが成功し、ダウンロード可能なURLが返却されることを確認
    expect(result).toBeDefined();
    expect(result.downloadUrl).toBe('https://s3.example.com/reports/deal-12345-20260115-abc123.pdf');
    expect(result.expiresAt).toBe('2026-01-16T11:00:00Z');

    // 有効期限が24時間後であることを確認
    const expiresAtDate = new Date(result.expiresAt);
    const generatedAtDate = new Date(fixedGeneratedAt);
    const diffMs = expiresAtDate.getTime() - generatedAtDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    expect(diffHours).toBe(24);
  });
});