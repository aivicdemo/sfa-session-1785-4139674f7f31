import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-075: 複数件の推奨を含むレポートが正常に生成される', async () => {
    // ===== Setup: Test Data =====
    const newCaseData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト太郎',
      industry: '製造業',
      employeeCount: 250,
      annualRevenue: 5000000000,
      mainChallenge: 'デジタル化推進',
      budgetAmount: 50000000,
      decisionTimeframe: '3ヶ月以内',
      proposalCategory: 'ERPシステム導入'
    };

    const mockRecommendations = [
      {
        recommendationId: 'REC-001',
        content: '段階的なERP導入を推奨（Phase 1: 基幹業務、Phase 2: 周辺業務）',
        reasoningBasis: '同規模・同業種の成功事例3件で段階導入により採用率が87%に達成。リスク最小化と予算効率性のバランスが最適',
        similarityScore: 0.92,
        confidenceScore: 0.88,
        appliedPatternId: 'PAT-MFG-ERP-001',
        estimatedSuccessProbability: 0.85
      },
      {
        recommendationId: 'REC-002',
        content: 'ベンダー選定時に導入実績が同業種で5件以上の企業を優先',
        reasoningBasis: '実績が少ないベンダーの場合、導入期間が平均30%延長される傾向。コスト超過リスクが高まる',
        similarityScore: 0.87,
        confidenceScore: 0.82,
        appliedPatternId: 'PAT-VENDOR-SEL-002',
        estimatedSuccessProbability: 0.79
      },
      {
        recommendationId: 'REC-003',
        content: '経営層向けに投資対効果を「3年でROI 150%達成」と説得',
        reasoningBasis: '業界平均ROIが3年で120-140%。本案件の規模と予算配分では150%が現実的。他6社の類似案件で実績確認済',
        similarityScore: 0.89,
        confidenceScore: 0.85,
        appliedPatternId: 'PAT-ROI-MSG-003',
        estimatedSuccessProbability: 0.82
      }
    ];

    // ===== Mock FileStorageAdapter =====
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/REC-20240115-001.pdf',
        uploadedAt: '2024-01-15T10:30:00Z',
        fileSize: 256000,
        expiresAt: '2024-02-15T10:30:00Z'
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // ===== Mock AIRecommendationEngine =====
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: mockRecommendations,
        analysisTimestamp: '2024-01-15T10:25:00Z',
        dataQualityScore: 0.93,
        analysisCompleteness: 'COMPLETE'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // ===== Mock Report Metadata Table =====
    const reportMetadataRecords: Array<{
      reportId: string;
      fileName: string;
      generatedAt: string;
      recommendationCount: number;
      fileKey: string;
      customerId: string;
      fileFormat: string;
    }> = [];

    // ===== Execute: Call the target function =====
    const reportResult = await generateRecommendationReport(
      newCaseData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
      (record) => {
        reportMetadataRecords.push(record);
      }
    );

    // ===== Verify: Report Structure and Content =====

    // (1) Multiple recommendations (3件以上) are included in the report
    expect(reportResult.recommendations.length).toBe(3);
    expect(reportResult.recommendations.length).toBeGreaterThanOrEqual(3);

    // (2) Each recommendation contains required fields: content, reasoning, similarity score
    reportResult.recommendations.forEach((rec, index) => {
      expect(rec).toHaveProperty('recommendationId');
      expect(rec).toHaveProperty('content');
      expect(typeof rec.content).toBe('string');
      expect(rec.content.length).toBeGreaterThan(0);

      expect(rec).toHaveProperty('reasoningBasis');
      expect(typeof rec.reasoningBasis).toBe('string');
      expect(rec.reasoningBasis.length).toBeGreaterThan(0);

      expect(rec).toHaveProperty('similarityScore');
      expect(typeof rec.similarityScore).toBe('number');
      expect(rec.similarityScore).toBeGreaterThanOrEqual(0);
      expect(rec.similarityScore).toBeLessThanOrEqual(1);

      expect(rec).toHaveProperty('confidenceScore');
      expect(typeof rec.confidenceScore).toBe('number');
    });

    // (3) Report structure is consistent with proper sections
    expect(reportResult).toHaveProperty('reportId');
    expect(reportResult).toHaveProperty('title');
    expect(reportResult).toHaveProperty('generatedAt');
    expect(reportResult).toHaveProperty('customerSummary');
    expect(reportResult).toHaveProperty('recommendations');
    expect(reportResult).toHaveProperty('analysisMetadata');

    expect(typeof reportResult.title).toBe('string');
    expect(reportResult.title.length).toBeGreaterThan(0);

    expect(typeof reportResult.generatedAt).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(reportResult.generatedAt)).toBe(true);

    expect(reportResult.customerSummary).toHaveProperty('customerId');
    expect(reportResult.customerSummary.customerId).toBe('CUST-20240115-001');

    // (4) FileStorageAdapter.uploadRecommendationReport is called exactly once with PDF format
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    const uploadCall = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0];
    expect(uploadCall).toBeDefined();

    const uploadedContent = uploadCall[0];
    expect(uploadedContent).toHaveProperty('reportId');
    expect(uploadedContent).toHaveProperty('format');
    expect(uploadedContent.format).toBe('PDF');

    const uploadResult = await mockFileStorageAdapter.uploadRecommendationReport(uploadedContent);
    expect(uploadResult).toHaveProperty('fileKey');
    expect(uploadResult.fileKey).toMatch(/\.pdf$/i);

    // (5) Report metadata is recorded with exactly 1 record containing correct fields
    expect(reportMetadataRecords.length).toBe(1);

    const metadata = reportMetadataRecords[0];
    expect(metadata).toHaveProperty('reportId');
    expect(metadata).toHaveProperty('fileName');
    expect(metadata).toHaveProperty('generatedAt');
    expect(metadata).toHaveProperty('recommendationCount');
    expect(metadata).toHaveProperty('fileKey');
    expect(metadata).toHaveProperty('customerId');
    expect(metadata).toHaveProperty('fileFormat');

    expect(metadata.reportId).toBe(reportResult.reportId);
    expect(metadata.fileName).toMatch(/REC-20240115/);
    expect(metadata.generatedAt).toBe('2024-01-15T10:30:00Z');
    expect(metadata.recommendationCount).toBe(3);
    expect(metadata.fileKey).toBe('reports/REC-20240115-001.pdf');
    expect(metadata.customerId).toBe('CUST-20240115-001');
    expect(metadata.fileFormat).toBe('PDF');

    // ===== Verify: Detailed Recommendation Content =====

    // Verify first recommendation content
    expect(reportResult.recommendations[0].content).toBe(
      '段階的なERP導入を推奨（Phase 1: 基幹業務、Phase 2: 周辺業務）'
    );
    expect(reportResult.recommendations[0].reasoningBasis).toContain('同規模・同業種');
    expect(reportResult.recommendations[0].similarityScore).toBe(0.92);

    // Verify second recommendation
    expect(reportResult.recommendations[1].content).toContain('ベンダー選定');
    expect(reportResult.recommendations[1].similarityScore).toBe(0.87);

    // Verify third recommendation
    expect(reportResult.recommendations[2].content).toContain('ROI 150%');
    expect(reportResult.recommendations[2].similarityScore).toBe(0.89);

    // ===== Verify: Analysis Metadata Quality =====
    expect(reportResult.analysisMetadata).toHaveProperty('dataQualityScore');
    expect(reportResult.analysisMetadata.dataQualityScore).toBe(0.93);
    expect(reportResult.analysisMetadata).toHaveProperty('analysisCompleteness');
    expect(reportResult.analysisMetadata.analysisCompleteness).toBe('COMPLETE');
  });
});