import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-071
  test('[normal] 推奨レポート生成機能 - 推奨内容がPDF形式のレポートで正常に生成される', async () => {
    // テスト用の新規案件データを準備
    const testCase = {
      customer_name: 'テスト太郎',
      industry: 'IT',
      budget_scale: 5000000,
      challenge: 'システム統合'
    };

    // AIRecommendationEngineのスタブを構成
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommended_approach: '段階的なシステム統合アプローチ',
        approach_description: '既存システムとの互換性を維持しながら、段階的に新システムを導入することで、リスクを最小化します。',
        similar_cases: [
          {
            company_name: '事例企業A',
            transaction_result: '成功',
            deal_amount: 4500000,
            implementation_period: '6ヶ月'
          },
          {
            company_name: '事例企業B',
            transaction_result: '成功',
            deal_amount: 5200000,
            implementation_period: '7ヶ月'
          },
          {
            company_name: '事例企業C',
            transaction_result: '成功',
            deal_amount: 4800000,
            implementation_period: '5ヶ月'
          }
        ],
        recommendation_basis: [
          '顧客の予算規模（500万円）は過去成功事例と合致',
          'IT業界のシステム統合案件は70%の成約率を実現',
          '段階的アプローチにより導入リスクを40%削減可能'
        ],
        confidence_score: 85
      })
    };

    // FileStorageAdapterのスタブを構成
    const expectedUploadDate = new Date('2024-01-15T11:00:00Z');
    const expectedExpirationDate = new Date('2024-02-14T11:00:00Z');

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3_key: 'recommendations/CASE-2024-001-report.pdf',
        file_size: 2500000,
        upload_timestamp: expectedUploadDate.toISOString(),
        expiration_timestamp: expectedExpirationDate.toISOString(),
        download_url: 'https://s3.amazonaws.com/bucket/recommendations/CASE-2024-001-report.pdf'
      })
    };

    // 推奨レポート生成機能を実行
    const result = await generateRecommendationReport(
      testCase,
      mockRecommendationEngine,
      mockFileStorageAdapter
    );

    // 生成されたPDFレポートのファイルサイズが1MB以上10MB未満であることを確認
    expect(result.file_size).toBeGreaterThanOrEqual(1048576);
    expect(result.file_size).toBeLessThan(10485760);

    // PDFレポートに以下の内容セクションが含まれていることを確認
    const reportContent = result.report_content;
    expect(reportContent).toContain('段階的なシステム統合アプローチ');
    expect(reportContent).toContain('既存システムとの互換性を維持しながら、段階的に新システムを導入することで、リスクを最小化します。');

    // 類似成功事例の企業名と商談結果を確認
    expect(reportContent).toContain('事例企業A');
    expect(reportContent).toContain('成功');
    expect(reportContent).toContain('事例企業B');
    expect(reportContent).toContain('事例企業C');

    // 推奨根拠の詳細説明を確認
    expect(reportContent).toContain('顧客の予算規模（500万円）は過去成功事例と合致');
    expect(reportContent).toContain('IT業界のシステム統合案件は70%の成約率を実現');
    expect(reportContent).toContain('段階的アプローチにより導入リスクを40%削減可能');

    // 生成日時と案件IDを確認
    expect(reportContent).toContain('2024-01-15');
    expect(reportContent).toContain('CASE-2024-001');

    // メタデータの有効期限が現在時刻から30日後に設定されていることを確認
    const uploadTime = new Date(result.upload_timestamp);
    const expirationTime = new Date(result.expiration_timestamp);
    const expectedDiffMs = 30 * 24 * 60 * 60 * 1000;
    const actualDiffMs = expirationTime.getTime() - uploadTime.getTime();
    expect(actualDiffMs).toBe(expectedDiffMs);

    // FileStorageAdapterのuploadRecommendationReportが正確に1回呼び出されたことを検証
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // 返却されたメタデータの構造を確認
    expect(result).toHaveProperty('s3_key');
    expect(result).toHaveProperty('file_size');
    expect(result).toHaveProperty('upload_timestamp');
    expect(result).toHaveProperty('expiration_timestamp');
    expect(result).toHaveProperty('download_url');

    // S3キーの形式を確認
    expect(result.s3_key).toMatch(/^recommendations\/CASE-\d{4}-\d{3}-report\.pdf$/);

    // ダウンロードURLの形式を確認
    expect(result.download_url).toMatch(/^https:\/\/s3\.amazonaws\.com\//);
  });
});