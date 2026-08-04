import {
  generateRecommendationReportWithDownloadUrl,
} from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・アップロード', () => {
  test('SCEN-165: 推奨内容がExcel形式でアップロード成功時にダウンロードURLが返却される', async () => {
    // テストデータ: 推奨内容（提案アプローチ、根拠説明、成功パターンスコア）
    const recommendationData = {
      proposalApproach: '顧客課題に基づいた段階的な導入アプローチ',
      reasoningExplanation:
        '過去の類似案件から抽出した成功パターンに基づいて推奨',
      successPatternScore: 85,
      customerId: 'CUST-001',
      dealId: 'DEAL-20240801-001',
      generatedAt: '2024-08-01T12:34:56Z',
    };

    // FileStorageAdapterのuploadRecommendationReportメソッドをスタブ化
    const mockUploadRecommendationReport = jest.fn().mockResolvedValue({
      bucketKey: 'recommendations/report_20240801_123456.xlsx',
      fileSize: 2048,
      uploadTimestamp: '2024-08-01T12:34:56Z',
    });

    // FileStorageAdapterのgeneratDownloadUrlメソッドをスタブ化
    // 有効期限付きURL（3600秒）を返すよう設定
    const mockGenerateDownloadUrl = jest.fn().mockResolvedValue({
      downloadUrl:
        'https://s3.amazonaws.com/bucket-name/recommendations/report_20240801_123456.xlsx?X-Amz-Signature=YXdzLWNyeXB0bzp0ZXN0c2lnbmF0dXJl&X-Amz-Expires=3600',
      expiresIn: 3600,
    });

    // ファイルストレージアダプタのスタブオブジェクト
    const fileStorageAdapterStub = {
      uploadRecommendationReport: mockUploadRecommendationReport,
      generateDownloadUrl: mockGenerateDownloadUrl,
    };

    // 推奨内容をExcel形式でシリアライズし、アップロード、ダウンロードURL取得を実行
    const result = await generateRecommendationReportWithDownloadUrl(
      recommendationData,
      fileStorageAdapterStub,
    );

    // アップロードメソッドが呼び出されたことを確認
    expect(mockUploadRecommendationReport).toHaveBeenCalled();

    // ダウンロードURLメソッドが呼び出されたことを確認
    expect(mockGenerateDownloadUrl).toHaveBeenCalled();

    // 返却されたURLが有効であることを確認
    expect(result.downloadUrl).toBeDefined();
    expect(result.downloadUrl).toContain(
      'https://s3.amazonaws.com/bucket-name/recommendations/report_20240801_123456.xlsx',
    );

    // URL内に対象Excelファイル名が含まれていることを確認
    expect(result.downloadUrl).toMatch(/report_20240801_123456\.xlsx/);

    // URL内に署名パラメータが含まれていることを確認
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=/);

    // 有効期限が3600秒であることを確認
    expect(result.expiresIn).toBe(3600);

    // URL形式の妥当性を確認（HTTPS、署名付きURL形式）
    expect(result.downloadUrl).toMatch(
      /^https:\/\/s3\.amazonaws\.com\/bucket-name\/recommendations\/report_\d+_\d+\.xlsx\?X-Amz-Signature=.+&X-Amz-Expires=3600$/,
    );
  });
});