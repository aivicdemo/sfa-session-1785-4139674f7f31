import { generateDownloadUrls } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-083
  test('[normal] ダウンロードURL生成機能 - ダウンロードURLが複数件のレポートメタデータに対して正常に生成される', () => {
    const report_metadata_1 = {
      report_id: 'RPT-001',
      file_name: 'recommendation_report_2024_01.pdf',
      s3_object_key: 'reports/2024/01/recommendation_report_2024_01.pdf',
      generated_at: new Date('2024-01-15T10:30:00Z')
    };

    const report_metadata_2 = {
      report_id: 'RPT-002',
      file_name: 'recommendation_report_2024_02.pdf',
      s3_object_key: 'reports/2024/02/recommendation_report_2024_02.pdf',
      generated_at: new Date('2024-01-22T14:45:00Z')
    };

    const report_metadata_3 = {
      report_id: 'RPT-003',
      file_name: 'recommendation_report_2024_03.pdf',
      s3_object_key: 'reports/2024/03/recommendation_report_2024_03.pdf',
      generated_at: new Date('2024-02-05T09:15:00Z')
    };

    const report_metadata_list = [
      report_metadata_1,
      report_metadata_2,
      report_metadata_3
    ];

    const call_history = [];

    const file_storage_adapter_stub = {
      generateDownloadUrl: jest.fn((s3_object_key: string) => {
        call_history.push(s3_object_key);
        const expiration_timestamp = Math.floor(Date.now() / 1000) + 3600;
        return `https://s3-bucket.amazonaws.com/${s3_object_key}?X-Amz-Signature=sig_${s3_object_key.replace(/\//g, '_')}&X-Amz-Expires=3600&X-Amz-Date=20240115T103000Z&expires=${expiration_timestamp}`;
      })
    };

    const result_urls = generateDownloadUrls(report_metadata_list, file_storage_adapter_stub);

    expect(result_urls).toHaveLength(3);

    expect(result_urls[0]).toMatch(/^https:\/\//);
    expect(result_urls[1]).toMatch(/^https:\/\//);
    expect(result_urls[2]).toMatch(/^https:\/\//);

    expect(result_urls[0]).toMatch(/X-Amz-Signature|expires/);
    expect(result_urls[1]).toMatch(/X-Amz-Signature|expires/);
    expect(result_urls[2]).toMatch(/X-Amz-Signature|expires/);

    const unique_urls = new Set(result_urls);
    expect(unique_urls.size).toBe(3);

    expect(file_storage_adapter_stub.generateDownloadUrl).toHaveBeenCalledTimes(3);
    expect(file_storage_adapter_stub.generateDownloadUrl).toHaveBeenNthCalledWith(
      1,
      'reports/2024/01/recommendation_report_2024_01.pdf'
    );
    expect(file_storage_adapter_stub.generateDownloadUrl).toHaveBeenNthCalledWith(
      2,
      'reports/2024/02/recommendation_report_2024_02.pdf'
    );
    expect(file_storage_adapter_stub.generateDownloadUrl).toHaveBeenNthCalledWith(
      3,
      'reports/2024/03/recommendation_report_2024_03.pdf'
    );
  });
});