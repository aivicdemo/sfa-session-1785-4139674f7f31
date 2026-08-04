import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ファイル生成・保存', () => {
  test('SCEN-1030: Amazon S3 2回の再試行後も失敗した場合、HTML形式で画面表示される', async () => {
    // ============================================================
    // セットアップ: FileStorageAdapter スタブの定義
    // ============================================================
    let uploadAttemptCount = 0;
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadAttemptCount++;
        throw new Error('S3 upload failed');
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // ============================================================
    // 入力データ: 推奨レポート生成の前提条件
    // ============================================================
    const recommendationReportInput = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-20240101-A',
      dealCondition: {
        industry: '製造業',
        companySize: '従業員数 500-1000人',
        annualRevenue: '50-100億円',
        currentChallenge: '生産効率化',
      },
      recommendedApproach: {
        strategyName: '段階的導入型提案',
        proposedSolution: 'IoTセンサー + クラウド分析基盤',
        implementationTimeline: '6ヶ月',
        expectedROI: 2.5,
      },
      reasoningBasis: {
        similarSuccessCases: 3,
        successRatePercentage: 85,
        riskFactors: ['導入期間の延長リスク', 'ユーザー教育負荷'],
        mitigationMeasures: ['段階的ロールアウト', 'オンサイト研修'],
      },
    };

    // ============================================================
    // 実行: AIエージェント推奨レポート生成・保存処理
    // ============================================================
    const result = await generateRecommendationReport(
      recommendationReportInput,
      fileStorageAdapterStub
    );

    // ============================================================
    // 検証1: FileStorageAdapter.uploadRecommendationReportが
    //        2回の再試行を含む計3回呼び出されたことを確認
    // ============================================================
    expect(uploadAttemptCount).toBe(3);
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // ============================================================
    // 検証2: 代替動作により HTML 形式の推奨内容が返却される
    // ============================================================
    expect(result).toHaveProperty('displayFormat');
    expect(result.displayFormat).toBe('html');

    // ============================================================
    // 検証3: HTML形式レポートに必須要素が含まれていることを確認
    //        - 顧客条件
    //        - 推奨アプローチ
    //        - 根拠説明
    // ============================================================
    expect(result).toHaveProperty('htmlContent');
    expect(typeof result.htmlContent).toBe('string');

    // 顧客条件の表示確認
    expect(result.htmlContent).toContain('製造業');
    expect(result.htmlContent).toContain('従業員数 500-1000人');
    expect(result.htmlContent).toContain('50-100億円');
    expect(result.htmlContent).toContain('生産効率化');

    // 推奨アプローチの表示確認
    expect(result.htmlContent).toContain('段階的導入型提案');
    expect(result.htmlContent).toContain('IoTセンサー');
    expect(result.htmlContent).toContain('6ヶ月');

    // 根拠説明の表示確認
    expect(result.htmlContent).toContain('85');
    expect(result.htmlContent).toContain('段階的ロールアウト');

    // ============================================================
    // 検証4: エラーメッセージが表示される
    // ============================================================
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.errorMessage).toMatch(/画面上で推奨内容を確認/);
    expect(result.errorMessage).toMatch(/再度お試しください/);

    // ============================================================
    // 検証5: ブラウザ保存機能で取得可能な状態
    //        - downloadable フラグが true
    //        - HTML コンテンツが妥当な形式
    // ============================================================
    expect(result).toHaveProperty('downloadable');
    expect(result.downloadable).toBe(true);

    // HTML形式の最小限の構造確認
    expect(result.htmlContent).toMatch(/<!DOCTYPE\s+html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);

    // ============================================================
    // 検証6: 推奨内容・根拠・商談条件が正確に表示されていることを確認
    //        具体的な数値・文字列の検証
    // ============================================================
    expect(result.htmlContent).toContain(recommendationReportInput.dealId);
    expect(result.htmlContent).toContain(recommendationReportInput.customerId);
    expect(result.htmlContent).toContain('2.5'); // expectedROI
    expect(result.htmlContent).toContain('3'); // similarSuccessCases

    // リスク要因の表示
    expect(result.htmlContent).toContain('導入期間の延長リスク');
    expect(result.htmlContent).toContain('ユーザー教育負荷');

    // 対応策の表示
    expect(result.htmlContent).toContain('オンサイト研修');
  });
});