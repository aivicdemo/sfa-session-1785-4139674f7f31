import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-690
  test('推奨内容のレポート生成・保存機能 - Amazon S3へのアップロードが2回連続で失敗した場合、HTML形式で画面表示される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('S3 upload failed'))
        .mockRejectedValueOnce(new Error('S3 upload failed'))
        .mockRejectedValueOnce(new Error('S3 upload failed')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const recommendationInput = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      recommendationContent: {
        proposalApproach: 'Expand market reach through regional partnerships',
        confidenceScore: 85,
        successPatternId: 'PATTERN-SP-001',
        recommendedActionTiming: '2024-02-15T09:00:00Z',
        recommendedQuantity: 150,
        riskFactors: ['Market volatility', 'Supplier availability']
      },
      reasoningBasis: {
        similarPatternCount: 12,
        historicalSuccessRate: 0.88,
        customerSegmentMatch: 0.92,
        pastCaseExamples: [
          {
            caseId: 'CASE-2023-0451',
            customerIndustry: 'Manufacturing',
            approachUsed: 'Regional partnership',
            conversionResult: 'success',
            adoptionRate: 0.95
          }
        ]
      },
      operationHistory: [
        {
          timestamp: '2024-02-01T10:30:00Z',
          userId: 'USR-0342',
          action: 'INPUT_CUSTOMER_INFO',
          status: 'completed'
        },
        {
          timestamp: '2024-02-01T10:35:00Z',
          userId: 'USR-0342',
          action: 'GENERATE_RECOMMENDATION',
          status: 'completed'
        }
      ]
    };

    const result = await generateRecommendationReport(
      recommendationInput,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    expect(result.contentType).toBe('text/html');

    expect(result.htmlContent).toMatch(/<!DOCTYPE html>/i);
    expect(result.htmlContent).toMatch(/<html[^>]*>/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);

    expect(result.htmlContent).toContain('Expand market reach through regional partnerships');
    expect(result.htmlContent).toContain('85');
    expect(result.htmlContent).toContain('Regional partnership');
    expect(result.htmlContent).toContain('0.88');
    expect(result.htmlContent).toContain('2024-02-01T10:30:00Z');
    expect(result.htmlContent).toContain('INPUT_CUSTOMER_INFO');
    expect(result.htmlContent).toContain('completed');

    expect(result.isHtmlFallback).toBe(true);
  });
});