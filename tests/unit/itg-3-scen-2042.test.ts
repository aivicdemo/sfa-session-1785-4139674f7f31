import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料の自動生成', () => {
  test('SCEN-2042: S3アップロード失敗時にHTML形式の画面表示による代替動作が実行される', async () => {
    // Arrange: テスト用のスタブFileStorageAdapterを準備
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockRejectedValueOnce(new Error('Network timeout')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // テスト入力データ: 顧客情報と提案内容
    const input = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社ABC',
      industryType: '製造業',
      businessChallenge: 'デジタル化推進による業務効率化',
      proposalContent: {
        title: 'デジタルトランスフォーメーション提案',
        targetOutcome: '業務効率30%向上、コスト削減年間5000万円',
        investmentAmount: 50000000,
        implementationPeriod: 12,
        riskFactors: ['導入期間中の業務中断リスク', 'スタッフトレーニング時間'],
        expectedROI: 2.5,
      },
      executiveAudienceContext: {
        decisionMakerRole: '経営層（CFO、COO）',
        keyDecisionCriteria: ['ROI', 'リスク管理', '実装可能性'],
      },
    };

    // Act: 経営層向け説得資料の自動生成を実行
    const result = await generateExecutivePersuasionMaterial(
      input,
      mockFileStorageAdapter
    );

    // Assert: 期待値の検証
    // (1) S3アップロード失敗時にuser向けメッセージが含まれることを確認
    expect(result.userMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );

    // (2) HTML形式で推奨内容がレンダリングされていることを確認
    expect(result.displayFormat).toBe('HTML');
    expect(result.htmlContent).toContain('デジタルトランスフォーメーション提案');
    expect(result.htmlContent).toContain('業務効率30%向上');
    expect(result.htmlContent).toContain('年間5000万円');
    expect(result.htmlContent).toContain('導入期間中の業務中断リスク');

    // (3) ブラウザ保存機能が利用可能な状態であることを確認
    expect(result.browserSaveEnabled).toBe(true);
    expect(result.suggestedFileName).toMatch(/executive_persuasion_.*\.html$/);

    // (4) S3アップロード処理が発生していないことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(result.s3UploadAttempted).toBe(false);
    expect(result.storageFormat).not.toBe('PDF');
    expect(result.storageFormat).not.toBe('EXCEL');

    // 再試行ロジックの動作確認
    // 初回失敗と2回目失敗は期待された挙動であることを確認
    const callOrder = mockFileStorageAdapter.uploadRecommendationReport.mock.calls;
    expect(callOrder.length).toBe(3);
  });
});