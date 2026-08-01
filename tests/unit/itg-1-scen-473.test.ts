import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-473
  test('営業担当者の営業活動ログが複数件の場合、全件に基づいて行動パターンが分析される', async () => {
    const salesUserId = 'sales_user_001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';

    const activityLogs = [
      {
        logId: 'log_001',
        salesUserId: 'sales_user_001',
        activityDate: '2024-01-15',
        activityType: '客先訪問',
        duration: 120,
        channel: '訪問'
      },
      {
        logId: 'log_002',
        salesUserId: 'sales_user_001',
        activityDate: '2024-01-20',
        activityType: '電話営業',
        duration: 45,
        channel: '電話'
      },
      {
        logId: 'log_003',
        salesUserId: 'sales_user_001',
        activityDate: '2024-01-25',
        activityType: '提案資料送付',
        duration: 0,
        channel: 'メール'
      }
    ];

    const result = await generateSalesActivityAnalysisReport({
      salesUserId: salesUserId,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
      activityLogs: activityLogs
    });

    expect(result.reportId).toBeDefined();
    expect(result.salesUserId).toBe('sales_user_001');
    expect(result.analysisStartDate).toBe('2024-01-01');
    expect(result.analysisEndDate).toBe('2024-01-31');
    expect(result.analysisResults.totalActivityCount).toBe(3);
    expect(result.analysisResults.visitFrequency).toBe('月1～2回');
    expect(result.analysisResults.averagePhoneCallDuration).toBe(45);
    expect(result.analysisResults.contactChannelDiversityScore).toBe('3/3');
    expect(result.analysisResults.contactChannels).toContain('訪問');
    expect(result.analysisResults.contactChannels).toContain('電話');
    expect(result.analysisResults.contactChannels).toContain('メール');
    expect(result.generatedAt).toBeDefined();
    expect(typeof result.generatedAt).toBe('string');
  });
});