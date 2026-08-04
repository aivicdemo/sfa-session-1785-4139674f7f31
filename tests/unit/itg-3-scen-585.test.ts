import { generateRecommendationReportWithEvidence } from '../../src/logic/it-1-br-3-1-1-1';

const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
};

const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・保存', () => {
  // SCEN-585
  test('推奨内容が1個のとき、1推奨を含むレポートが生成される', async () => {
    const testCaseId = 'SCEN-585';
    
    // モック設定: AIRecommendationEngine.generateRecommendation
    const mockRecommendation = {
      recommendationId: 'REC-001',
      content: '顧客の業種・規模から、提案アプローチA（サービスプランX）を推奨します',
      reasoningExplanation: '過去の類似案件（同業種・同規模の10件）のうち8件が本提案アプローチで成約しており、成功率は80%です。当該顧客の経営課題（コスト削減）も一致しています。',
      confidenceScore: 85,
      relatedPatterns: ['PATTERN-C-SIZE-LARGE', 'PATTERN-INDUSTRY-RETAIL'],
    };
    
    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue([mockRecommendation]);
    
    // モック設定: FileStorageAdapter.uploadRecommendationReport
    const mockUploadResponse = {
      fileKey: 'reports/REC-001-20240115-110000.pdf',
      s3Path: 's3://ai-recommendation-bucket/reports/REC-001-20240115-110000.pdf',
      uploadTimestamp: '2024-01-15T11:00:00Z',
    };
    
    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue(mockUploadResponse);
    
    // テスト入力: 新規案件情報
    const testDealInput = {
      customerName: 'テスト顧客A',
      industryCode: 'RETAIL',
      companySize: 'LARGE',
      dealDescription: 'テスト顧客Aへの初回提案',
      dealValue: 5000000,
      dealStage: 'INITIAL_CONTACT',
      generationTimestamp: new Date('2024-01-15T11:00:00Z'),
    };
    
    // 実行: レポート生成・保存機能を呼び出し
    const result = await generateRecommendationReportWithEvidence(
      testDealInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );
    
    // 検証1: 生成されたレポートに1個の推奨が含まれる
    expect(result.reportContent.recommendations).toHaveLength(1);
    expect(result.reportContent.recommendations[0].recommendationId).toBe('REC-001');
    expect(result.reportContent.recommendations[0].content).toBe(
      '顧客の業種・規模から、提案アプローチA（サービスプランX）を推奨します'
    );
    
    // 検証2: 根拠説明が含まれる
    expect(result.reportContent.recommendations[0].reasoningExplanation).toBe(
      '過去の類似案件（同業種・同規模の10件）のうち8件が本提案アプローチで成約しており、成功率は80%です。当該顧客の経営課題（コスト削減）も一致しています。'
    );
    
    // 検証3: 信頼度スコアが含まれる
    expect(result.reportContent.recommendations[0].confidenceScore).toBe(85);
    
    // 検証4: 案件情報が正確に記載される
    expect(result.reportContent.dealInfo.customerName).toBe('テスト顧客A');
    expect(result.reportContent.dealInfo.industryCode).toBe('RETAIL');
    expect(result.reportContent.dealInfo.companySize).toBe('LARGE');
    expect(result.reportContent.dealInfo.dealValue).toBe(5000000);
    
    // 検証5: 生成日時が記録される
    expect(result.reportContent.generatedAt).toBe('2024-01-15T11:00:00Z');
    
    // 検証6: FileStorageAdapterが正確に1回呼び出される
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    
    // 検証7: アップロード時の呼び出し引数を確認
    const uploadCallArgs = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0];
    expect(uploadCallArgs[0].recommendations).toHaveLength(1);
    expect(uploadCallArgs[0].dealInfo.customerName).toBe('テスト顧客A');
    
    // 検証8: レポートフォーマットがPDFであることを確認
    expect(result.reportFormat).toBe('PDF');
    
    // 検証9: S3アップロード結果が返却される
    expect(result.s3Path).toBe('s3://ai-recommendation-bucket/reports/REC-001-20240115-110000.pdf');
    expect(result.fileKey).toBe('reports/REC-001-20240115-110000.pdf');
    
    // 検証10: レポートメタデータが1件保存される
    expect(result.reportMetadata).toBeDefined();
    expect(result.reportMetadata.fileKey).toBe('reports/REC-001-20240115-110000.pdf');
    expect(result.reportMetadata.recommendationCount).toBe(1);
    expect(result.reportMetadata.dealValue).toBe(5000000);
  });
});