import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポートファイル生成・保存', () => {
  test('SCEN-586: 推奨内容が複数個のときすべての推奨を含むレポートが生成される', () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockRecommendations = [
      {
        id: 'rec-001',
        content: '顧客業種がIT企業のため、DXソリューション提案を推奨',
        reasoning: '過去の類似案件で同業種への提案採用率が85%と高い。顧客規模が従業員500名以上で、予算規模が大きい傾向にあり、投資判断が迅速である。'
      },
      {
        id: 'rec-002',
        content: '初回接触から3営業日以内のフォローアップを推奨',
        reasoning: 'IT企業顧客の購買プロセスは平均5営業日。初回接触3日以内のフォローアップで成約率が72%に上昇。遅延すると競合提案に切り替わる傾向が強い。'
      },
      {
        id: 'rec-003',
        content: '経営層向けROI試算資料の事前準備を推奨',
        reasoning: '同業種・同規模顧客への提案で、ROI試算資料を初回提示した案件の成約率が68%。資料なしの場合は41%に低下。経営層の意思決定加速に効果的。'
      }
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendations),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        url: 'https://example-s3-bucket.s3.amazonaws.com/reports/rec-report-20240115.pdf',
        uploadedAt: '2024-01-15T11:00:00Z',
        expiresAt: '2024-02-15T11:00:00Z'
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const inputCondition = {
      customerId: 'cust-001',
      customerName: '株式会社テックソリューション',
      industry: 'IT',
      companySize: 'large',
      dealStage: 'initial-contact',
      dealValue: 5000000,
      proposedProducts: ['DXソリューション'],
      dealTimestamp: '2024-01-15T10:00:00Z'
    };

    // Act: レポートファイル生成・保存機能を実行
    const result = generateRecommendationReport(
      inputCondition,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: FileStorageAdapterのuploadRecommendationReportが呼ばれたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // Assert: uploadRecommendationReportの第1引数（レポート内容）を検証
    const reportContent = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0][0];

    // 推奨1の内容がレポートに含まれていることを確認
    expect(reportContent).toContain('rec-001');
    expect(reportContent).toContain('顧客業種がIT企業のため、DXソリューション提案を推奨');
    expect(reportContent).toContain('過去の類似案件で同業種への提案採用率が85%と高い');

    // 推奨2の内容がレポートに含まれていることを確認
    expect(reportContent).toContain('rec-002');
    expect(reportContent).toContain('初回接触から3営業日以内のフォローアップを推奨');
    expect(reportContent).toContain('IT企業顧客の購買プロセスは平均5営業日');

    // 推奨3の内容がレポートに含まれていることを確認
    expect(reportContent).toContain('rec-003');
    expect(reportContent).toContain('経営層向けROI試算資料の事前準備を推奨');
    expect(reportContent).toContain('同業種・同規模顧客への提案で、ROI試算資料を初回提示した案件の成約率が68%');

    // Assert: アップロード成功時のレスポンス検証
    expect(result.uploadStatus).toBe('success');
    expect(result.reportUrl).toBe('https://example-s3-bucket.s3.amazonaws.com/reports/rec-report-20240115.pdf');
    expect(result.recommendationCount).toBe(3);
    expect(result.expiresAt).toBe('2024-02-15T11:00:00Z');

    // Assert: 生成されたレポート内の推奨数を検証
    expect(result.includedRecommendationIds).toEqual(['rec-001', 'rec-002', 'rec-003']);
  });
});