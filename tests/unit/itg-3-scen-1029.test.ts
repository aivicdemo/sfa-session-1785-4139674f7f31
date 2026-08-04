import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ファイル生成・保存時のリトライ処理', () => {
  // SCEN-1029
  test('Amazon S32回目アップロード失敗時、10秒後に再試行される', async () => {
    const now = new Date('2024-01-15T11:00:00Z');
    const callTimestamps: Date[] = [];
    let callCount = 0;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        callCount++;
        callTimestamps.push(new Date(now.getTime() + callCount * 1000));
        
        if (callCount === 1) {
          throw new Error('Connection timeout');
        }
        
        return {
          uploadedAt: callTimestamps[callCount - 1],
          fileUrl: 'https://s3.example.com/reports/rec-001-2024-01-15.pdf',
          fileSize: 1024 * 512,
        };
      }),
    };

    const recommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-001',
      dealId: 'deal-001',
      proposedApproach: '顧客の経営課題に対応した段階的な導入提案',
      confidenceScore: 87,
      supportingFactors: [
        '過去の類似案件で同じ提案アプローチが採用率72%を達成',
        '顧客の業種・規模が成功パターンマスタの主要セグメントと一致',
        'フォローアップタイミングが購買シグナル検知から3営業日以内',
      ],
      risks: [
        '顧客の予算承認プロセスが複雑で実行までに30日要する可能性',
      ],
      recommendedTiming: '2024-01-22T09:00:00Z',
      format: 'PDF',
    };

    const generatedReportContent = {
      reportId: 'report-001',
      title: '営業推奨レポート - 案件REC-001',
      generatedAt: '2024-01-15T11:00:00Z',
      recommendation: recommendationData,
      pdfBuffer: Buffer.from('PDF content mock'),
    };

    const result = await generateRecommendationReport(
      recommendationData,
      mockFileStorageAdapter,
      10000
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);
    
    const firstCallTimestamp = callTimestamps[0];
    const secondCallTimestamp = callTimestamps[1];
    
    const timeBetweenRetries = secondCallTimestamp.getTime() - firstCallTimestamp.getTime();
    expect(timeBetweenRetries).toBeGreaterThanOrEqual(9900);
    expect(timeBetweenRetries).toBeLessThanOrEqual(10100);
    
    expect(result).toEqual({
      success: true,
      fileUrl: 'https://s3.example.com/reports/rec-001-2024-01-15.pdf',
      fileSize: 1024 * 512,
      retryCount: 1,
      retryExecutedAt: expect.any(Date),
      uploadCompletedAt: expect.any(Date),
    });
  });
});