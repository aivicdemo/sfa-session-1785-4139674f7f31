import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1114
  test('[error] 推奨レポート生成・保存機能 (Amazon S3 連携) - IAM権限不足エラーで HTML表示フォールバック', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error(
          'AccessDenied: User: arn:aws:iam::123456789:user/test-user is not authorized to perform: s3:PutObject on resource: arn:aws:s3:::report-bucket/*'
        )
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationInput = {
      recommendationApproach: '顧客の業種別成功パターンに基づいた段階的提案アプローチ',
      evidenceData: [
        {
          pastCaseId: 'CASE-001',
          similarityScore: 92,
          successFactor: '同一業種での導入経験が豊富',
          contractedAmount: 5000000,
        },
        {
          pastCaseId: 'CASE-002',
          similarityScore: 87,
          successFactor: 'エグゼキューティブ関係者との事前調整',
          contractedAmount: 4200000,
        },
      ],
      reliabilityScore: 85,
      riskFactors: ['予算承認プロセスの複雑性', '競合製品との比較検討期間'],
      nextActions: ['経営層向け説得資料の準備', '導入タイムラインの再確認'],
    };

    const result = await generateRecommendationReport(
      recommendationInput,
      mockFileStorageAdapter
    );

    // (1) エラーメッセージがユーザーに表示される
    expect(result.userMessage).toMatch(
      /レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください/
    );

    // (2) 推奨内容が HTML 形式で画面にレンダリングされる
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toMatch(/<html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);

    // (3) HTML に推奨アプローチが含まれている
    expect(result.htmlContent).toContain('顧客の業種別成功パターンに基づいた段階的提案アプローチ');

    // (4) HTML に根拠データが含まれている
    expect(result.htmlContent).toContain('CASE-001');
    expect(result.htmlContent).toContain('92');
    expect(result.htmlContent).toContain('同一業種での導入経験が豊富');

    // (5) HTML に信頼度スコアが含まれている
    expect(result.htmlContent).toContain('85');

    // (6) HTML にリスク要因が含まれている
    expect(result.htmlContent).toContain('予算承認プロセスの複雑性');
    expect(result.htmlContent).toContain('競合製品との比較検討期間');

    // (7) HTML に次アクションが含まれている
    expect(result.htmlContent).toContain('経営層向け説得資料の準備');
    expect(result.htmlContent).toContain('導入タイムラインの再確認');

    // (8) ダウンロード機能が無効な状態
    expect(result.downloadEnabled).toBe(false);

    // (9) ファイル形式でのアップロードが試行されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationApproach: '顧客の業種別成功パターンに基づいた段階的提案アプローチ',
      }),
      expect.any(String)
    );

    // (10) 返却結果が HTML フォールバックモードであることを確認
    expect(result.mode).toBe('html-fallback');
  });
});