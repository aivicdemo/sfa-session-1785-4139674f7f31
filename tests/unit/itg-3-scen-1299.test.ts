import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1299: 推奨レポート生成・保存機能 - Amazon S3へのアップロード成功時にダウンロードURLが返却される', async () => {
    const recommendationContent = {
      recommendation_id: 'rec-20240115-001',
      customer_id: 'cust-12345',
      proposal_approach: '顧客の業種が製造業で、規模が中堅企業のため、生産効率化ソリューションを推奨',
      confidence_score: 85,
      success_pattern_reference: 'pattern-manufacturing-mid-size',
      supporting_evidence: ['過去3件の類似案件で成約', '顧客の現在の課題が成功パターンと一致'],
    };

    const customerInfo = {
      customer_id: 'cust-12345',
      customer_name: '株式会社製造太郎',
      industry: '製造業',
      company_size: '中堅企業',
      contact_person: '営業太郎',
    };

    const dealConditions = {
      deal_id: 'deal-20240115-001',
      deal_status: '初回商談',
      estimated_deal_amount: 5000000,
      expected_close_date: '2024-03-31',
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_key: 'reports/rec-20240115-001/report.pdf',
        upload_timestamp: '2024-01-15T11:00:00Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        download_url: 'https://s3.amazonaws.com/sales-reports/rec-20240115-001/report.pdf?X-Amz-Expires=3600&X-Amz-Signature=abc123&X-Amz-Credential=AKIA...',
        expiration_unix_timestamp: 1705325200,
      }),
    };

    const result = await generateRecommendationReport(
      recommendationContent,
      customerInfo,
      dealConditions,
      mockFileStorageAdapter
    );

    expect(result).toBeDefined();
    expect(typeof result.download_url).toBe('string');
    expect(result.download_url.startsWith('https://')).toBe(true);
    expect(result.download_url).toMatch(/X-Amz-Expires=\d+/);
    expect(result.download_url).toMatch(/expires=\d+|X-Amz-Expires/);
    
    expect(result.file_metadata).toBeDefined();
    expect(result.file_metadata.file_key).toBe('reports/rec-20240115-001/report.pdf');
    expect(result.file_metadata.generated_at).toBe('2024-01-15T11:00:00Z');
    expect(typeof result.file_metadata.expiration_unix_timestamp).toBe('number');
    expect(result.file_metadata.expiration_unix_timestamp).toBe(1705325200);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendation_id: 'rec-20240115-001',
        customer_id: 'cust-12345',
      }),
      expect.objectContaining({
        customer_name: '株式会社製造太郎',
        industry: '製造業',
      }),
      expect.objectContaining({
        deal_id: 'deal-20240115-001',
      })
    );

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      'reports/rec-20240115-001/report.pdf',
      expect.any(Number)
    );
  });
});