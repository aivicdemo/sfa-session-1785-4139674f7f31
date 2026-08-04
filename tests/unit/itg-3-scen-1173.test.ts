import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1173: レポート生成・保存機能 - 推奨内容をPDF形式でファイル生成・S3アップロードが正常完了したとき、ダウンロードURLを返却する', async () => {
    // Arrange: テストデータの準備
    const recommendation_object = {
      approach: '新規営業活動による市場開拓',
      reasoning: [
        '顧客業種は成長産業であり、市場拡大の機会がある',
        '過去類似案件での成約率は85%と高い',
        '営業担当者の経験値が豊富である'
      ],
      confidence_score: 87,
      recommendation_id: 'rec_20260801_abc123',
      generated_at: '2026-08-01T10:30:00Z'
    };

    const expected_object_key = 'reports/recommendation_20260801_abc123.pdf';
    const expected_download_url = 'https://bucket-name.s3.amazonaws.com/reports/recommendation_20260801_abc123.pdf?X-Amz-Expires=3600&X-Amz-Signature=abc123def456ghi789';

    // Mock AIRecommendationEngine.generateRecommendation
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendation_object)
    };

    // Mock FileStorageAdapter.uploadRecommendationReport
    const mock_upload_report = jest.fn().mockResolvedValue(expected_object_key);

    // Mock FileStorageAdapter.generateDownloadUrl
    const mock_generate_url = jest.fn().mockResolvedValue(expected_download_url);

    const mock_file_storage = {
      uploadRecommendationReport: mock_upload_report,
      generateDownloadUrl: mock_generate_url
    };

    // Act: レポート生成・保存機能を実行
    const result = await generateRecommendationReport(
      recommendation_object,
      mock_ai_engine,
      mock_file_storage
    );

    // Assert: uploadRecommendationReportが呼び出されたことを確認
    expect(mock_upload_report).toHaveBeenCalledTimes(1);
    expect(mock_upload_report).toHaveBeenCalledWith(recommendation_object);

    // Assert: generateDownloadUrlが呼び出され、S3オブジェクトキーを引数として渡されたことを確認
    expect(mock_generate_url).toHaveBeenCalledTimes(1);
    expect(mock_generate_url).toHaveBeenCalledWith(expected_object_key);

    // Assert: 関数の戻り値を検証
    expect(result).toBe(expected_download_url);
    expect(result).toMatch(/^https:\/\/bucket-name\.s3\.amazonaws\.com/);
    expect(result).toMatch(/X-Amz-Expires=3600/);
    expect(result).toMatch(/X-Amz-Signature=/);
  });
});