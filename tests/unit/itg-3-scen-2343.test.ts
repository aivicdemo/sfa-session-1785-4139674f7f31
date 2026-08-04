import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2343
  test('推奨データが1件のときレポートに1件分の内容が記載される', () => {
    // Arrange: スタブの定義
    const mockRecommendationData = {
      recommendation_id: 'REC-001',
      proposal_approach: '顧客課題に基づくソリューション提案',
      reasoning_basis: '過去成功事例との類似度85%',
      confidence_score: 85,
      salesperson_id: 'SP-12345',
      customer_id: 'CUST-98765',
      generated_at: '2024-03-15T10:30:00Z',
    };

    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([mockRecommendationData]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const stubFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_id: 'FILE-001',
        download_url: 'https://s3.example.com/reports/REC-001.pdf',
        expiration_time: '2024-03-22T10:30:00Z',
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Act: レポート生成メソッドを呼び出し
    const reportResult = generateRecommendationReport(
      [mockRecommendationData],
      stubAIRecommendationEngine,
      stubFileStorageAdapter
    );

    // Assert: レポート内容の検証
    expect(reportResult).toBeDefined();
    expect(reportResult.recommendations).toHaveLength(1);
    expect(reportResult.recommendations[0].recommendation_id).toBe('REC-001');
    expect(reportResult.recommendations[0].proposal_approach).toBe('顧客課題に基づくソリューション提案');
    expect(reportResult.recommendations[0].reasoning_basis).toBe('過去成功事例との類似度85%');
    expect(reportResult.recommendations[0].confidence_score).toBe(85);
    expect(reportResult.recommendations[0].salesperson_id).toBe('SP-12345');
    expect(reportResult.recommendations[0].customer_id).toBe('CUST-98765');
    expect(reportResult.recommendations[0].generated_at).toBe('2024-03-15T10:30:00Z');

    // メタデータの検証
    expect(reportResult.metadata).toBeDefined();
    expect(reportResult.metadata.total_recommendations).toBe(1);
    expect(reportResult.metadata.report_generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

    // ファイルストレージへのアップロード検証
    expect(stubFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(reportResult.file_id).toBe('FILE-001');
    expect(reportResult.download_url).toBe('https://s3.example.com/reports/REC-001.pdf');
  });
});