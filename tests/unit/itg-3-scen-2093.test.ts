import { analyzeProposalAndCustomerPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2093
  test('[normal] 提案内容と顧客対応パターンの標準プロセス照合分析 - ファイルアップロード失敗時、分析結果がHTML形式で画面表示される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('Upload failed'))
        .mockRejectedValueOnce(new Error('Upload failed'))
        .mockRejectedValueOnce(new Error('Upload failed')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'Recommended approach for customer segment A',
        confidenceScore: 85,
        reasoningBasis: [
          { factor: 'customer_industry', value: 'Technology', weight: 0.3 },
          { factor: 'deal_stage', value: 'qualification', weight: 0.25 },
          { factor: 'success_pattern_match', value: 0.92, weight: 0.45 },
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'case_001',
          similarity: 0.88,
          outcome: 'success',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'Based on historical data, similar customers in the technology sector at qualification stage have a 88% success rate with this approach.',
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const proposalContent = {
      customerId: 'cust_12345',
      dealId: 'deal_67890',
      proposalText: 'We recommend a phased implementation approach starting with core modules',
      customerResponsePattern: 'positive_engagement_with_budget_questions',
    };

    const result = await analyzeProposalAndCustomerPattern(
      proposalContent,
      mockFileStorageAdapter,
      mockAIRecommendationEngine,
    );

    expect(result.uploadStatus).toBe('failed');
    expect(result.retryCount).toBe(3);
    expect(result.fallbackMode).toBe('html_display');
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toContain('<html>');
    expect(result.htmlContent).toContain('<body>');
    expect(result.htmlContent).toContain('</body>');
    expect(result.htmlContent).toContain('</html>');
    expect(result.displayMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.userCanDownload).toBe(true);

    expect(result.htmlContent).toContain('Recommended approach for customer segment A');
    expect(result.htmlContent).toContain('85');
    expect(result.htmlContent).toContain('technology');
    expect(result.htmlContent).toContain('qualification');

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});