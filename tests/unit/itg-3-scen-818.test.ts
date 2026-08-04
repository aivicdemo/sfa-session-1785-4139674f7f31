import { generateRecommendationWithReportFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - ファイルストレージ連携（失敗時振る舞い）', () => {
  // SCEN-818
  test('S3アップロード失敗時、推奨内容がHTML形式で画面表示される', async () => {
    // ========== セットアップ ==========
    const customerId = 'CUST-001';
    const dealId = 'DEAL-2024-001';
    const customerName = 'テスト顧客';
    const industry = '製造業';
    const companySize = '大企業';
    const dealCondition = '新規提案';
    const timestamp = new Date('2024-03-15T10:30:00Z');

    // モック用の推奨内容（AIRecommendationEngineが返すデータ）
    const mockRecommendationContent = {
      proposalApproach: '段階的な導入アプローチで、まずパイロットプロジェクトを提案',
      rationale: '同業種の大企業5社が段階的導入で成功している実績あり',
      successPattern: '初期投資30%削減、導入期間6ヶ月短縮',
      confidenceScore: 92,
    };

    // HTML形式のレポート内容（フォールバック時に表示）
    const expectedHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head><title>推奨内容</title></head>
      <body>
        <h1>AIエージェント推奨内容</h1>
        <p>提案アプローチ: ${mockRecommendationContent.proposalApproach}</p>
        <p>根拠: ${mockRecommendationContent.rationale}</p>
        <p>成功パターン: ${mockRecommendationContent.successPattern}</p>
        <p>信頼度スコア: ${mockRecommendationContent.confidenceScore}</p>
      </body>
      </html>
    `;

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: mockRecommendationContent.proposalApproach,
        rationale: mockRecommendationContent.rationale,
        successPattern: mockRecommendationContent.successPattern,
        confidenceScore: mockRecommendationContent.confidenceScore,
      }),
    };

    // FileStorageAdapterのスタブ（S3アップロード失敗を模擬）
    let uploadAttemptCount = 0;
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            uploadAttemptCount += 1;
            // 最大2回の再試行後、失敗を返す
            reject(new Error('S3アップロード失敗: 503 Service Unavailable'));
          })
      ),
    };

    // システムログを記録するスタブ
    const systemLogs: Array<{
      timestamp: Date;
      message: string;
      attemptNumber: number;
    }> = [];
    const mockLogger = {
      logRetryAttempt: jest.fn((attemptNum: number) => {
        systemLogs.push({
          timestamp: new Date(timestamp.getTime() + attemptNum * 1000),
          message: `S3アップロード再試行 ${attemptNum} 回目`,
          attemptNumber: attemptNum,
        });
      }),
    };

    // ========== 実行 ==========
    const result = await generateRecommendationWithReportFallback(
      {
        customerId,
        dealId,
        customerName,
        industry,
        companySize,
        dealCondition,
      },
      mockAIEngine,
      mockFileStorage,
      mockLogger
    );

    // ========== 検証 ==========
    // 1. 推奨内容がHTML形式で画面表示されることを確認
    expect(result.displayFormat).toBe('html');

    // 2. 表示されるHTML内に、AIエージェントから生成された推奨内容が含まれていることを確認
    expect(result.htmlContent).toContain(mockRecommendationContent.proposalApproach);
    expect(result.htmlContent).toContain(mockRecommendationContent.rationale);
    expect(result.htmlContent).toContain(mockRecommendationContent.successPattern);
    expect(result.htmlContent).toContain(String(mockRecommendationContent.confidenceScore));

    // 3. ユーザーメッセージが画面上に表示されることを確認
    expect(result.userMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );

    // 4. ブラウザ保存機能対応のためのHTMLが有効であることを確認
    expect(result.htmlContent).toContain('<!DOCTYPE html>');
    expect(result.htmlContent).toContain('</html>');
    expect(result.isSaveable).toBe(true);

    // 5. S3アップロード失敗後、最大2回の再試行が実行された履歴がログに記録されていることを確認
    expect(systemLogs.length).toBe(2);
    expect(systemLogs[0].attemptNumber).toBe(1);
    expect(systemLogs[1].attemptNumber).toBe(2);
    expect(systemLogs[0].message).toContain('再試行');
    expect(systemLogs[1].message).toContain('再試行');

    // 再試行のタイミングが正しいことを確認
    const timingFirstRetry = systemLogs[0].timestamp.getTime() - timestamp.getTime();
    const timingSecondRetry = systemLogs[1].timestamp.getTime() - timestamp.getTime();
    expect(timingFirstRetry).toBeGreaterThanOrEqual(3000); // 初回3秒後
    expect(timingSecondRetry).toBeGreaterThanOrEqual(13000); // 2回目10秒後

    // AIエージェント呼び出しが実行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith({
      customerId,
      dealId,
      customerName,
      industry,
      companySize,
      dealCondition,
    });

    // FileStorageAdapterのアップロード呼び出しが最大2回実行されたことを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // S3アップロード失敗時のフォールバック処理が正常に動作したことを確認
    expect(result.fallbackApplied).toBe(true);
    expect(result.uploadFailed).toBe(true);
  });
});