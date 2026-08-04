import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化 - レポート生成失敗時のHTML代替処理', () => {
  // SCEN-1174
  test('S3へのアップロード失敗時、最大2回の再試行後にHTML形式で画面表示用データを返却する', async () => {
    const mockRecommendation = {
      approach: '顧客の経営課題に対応した3段階の提案フェーズ',
      reasoning: '過去の類似案件（件数：45件、成功率：82%）の分析結果から、段階的なアプローチが最適と判定',
      confidenceScore: 87,
      successFactors: [
        '初期ヒアリングで経営層の意思確認を実施',
        'ROI試算を含む提案資料の事前提供',
        '競合対策を含むリスク分析の共有'
      ],
      relatedCaseStudies: [
        { caseId: 'CASE-2024-001', industry: '金融', resultStatus: 'won' },
        { caseId: 'CASE-2024-002', industry: '製造', resultStatus: 'won' }
      ]
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('403 Forbidden'))
        .mockRejectedValueOnce(new Error('403 Forbidden'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
    };

    const startTime = Date.now();
    const result = await generateRecommendationReportWithFallback(
      mockRecommendation,
      mockFileStorageAdapter
    );
    const endTime = Date.now();

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    const elapsedMs = endTime - startTime;
    expect(elapsedMs).toBeGreaterThanOrEqual(13000);
    expect(elapsedMs).toBeLessThan(15000);

    expect(result).toBeDefined();
    expect(result.contentType).toBe('text/html');
    expect(result.format).toBe('html');

    expect(result.htmlContent).toContain('<div');
    expect(result.htmlContent).toContain('</div>');
    expect(result.htmlContent).toContain(mockRecommendation.approach);

    expect(result.htmlContent).toContain('<p');
    expect(result.htmlContent).toContain('</p>');
    expect(result.htmlContent).toContain(mockRecommendation.reasoning);

    expect(result.htmlContent).toContain('<span');
    expect(result.htmlContent).toContain('</span>');
    expect(result.htmlContent).toContain('87');

    expect(result.htmlContent).toContain('金融');
    expect(result.htmlContent).toContain('製造');
    expect(result.htmlContent).toContain('CASE-2024-001');
    expect(result.htmlContent).toContain('CASE-2024-002');

    expect(result.isDisplayReady).toBe(true);
    expect(result.fallbackApplied).toBe(true);
    expect(result.s3UploadSucceeded).toBe(false);
  });
});