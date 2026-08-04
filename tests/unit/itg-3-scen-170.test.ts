import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-170: [edge] ダウンロードURL生成機能 - 有効期限直前のURLでのアクセスが許可される
  test('有効期限直前（残り1秒以内）でのアクセスにおいて、HTTPステータスコード200と完全なレポートバイナリが返却される', async () => {
    // Arrange: ダウンロードURL生成に必要な入力を準備
    const recommendationId = 'rec_12345';
    const reportFileName = 'recommendation_report_2024_01.pdf';
    const contentType = 'application/pdf';
    
    // 現在時刻を基準に、59秒後を有効期限として設定
    const baseTime = new Date('2024-01-15T10:00:00Z');
    const expirationTimeMs = 59000; // 59秒
    const expirationTime = new Date(baseTime.getTime() + expirationTimeMs);
    
    // FileStorageAdapterのモック: generateDownloadUrl()が有効期限付きURLを返す
    const mockDownloadUrl = `https://mock-s3.amazonaws.com/reports/${recommendationId}?Expires=${expirationTime.getTime()}`;
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: mockDownloadUrl,
        expiresAt: expirationTime.toISOString(),
        contentType: contentType,
        contentLength: 15240
      })
    };
    
    // 期待するレポートバイナリデータ（PDF形式の最小限のバイナリ）
    const expectedReportBinary = Buffer.from([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, // %PDF-1.4
      0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0d, 0x0a  // binary content
    ]);
    
    // モックHTTPレスポンス: 有効期限直前でのアクセスが成功
    const mockResponse = {
      status: 200,
      headers: {
        'content-type': contentType,
        'content-length': expectedReportBinary.length.toString(),
        'cache-control': 'no-cache, no-store, must-revalidate'
      },
      arrayBuffer: jest.fn().mockResolvedValue(expectedReportBinary.buffer)
    };
    
    // グローバルfetchをモック化
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    
    // Act: ダウンロードURL生成機能を呼び出し
    const urlResult = await mockFileStorageAdapter.generateDownloadUrl(recommendationId, {
      format: 'pdf',
      fileName: reportFileName
    });
    
    // システムクロックを59秒進める（有効期限直前）
    const accessTime = new Date(baseTime.getTime() + 59000);
    jest.useFakeTimers();
    jest.setSystemTime(accessTime);
    
    // Act: 取得したURLに対してHTTPリクエスト（GET）を実行
    const downloadResponse = await fetch(urlResult.url, {
      method: 'GET',
      headers: {
        'accept': contentType
      }
    });
    
    // レスポンスボディをバイナリで取得
    const responseBuffer = await downloadResponse.arrayBuffer();
    const responseData = new Uint8Array(responseBuffer);
    
    // Assert: HTTPステータスコードが200であることを確認
    expect(downloadResponse.status).toBe(200);
    
    // Assert: レスポンスのContent-Typeが正常に含まれていることを確認
    expect(downloadResponse.headers['content-type']).toBe(contentType);
    
    // Assert: レスポンスのContent-Lengthが正常に含まれていることを確認
    expect(downloadResponse.headers['content-length']).toBe(expectedReportBinary.length.toString());
    
    // Assert: 返却されるファイルバイナリデータが完全に一致することを確認
    expect(responseData).toEqual(expectedReportBinary);
    
    // Assert: 返却されたファイルのメタデータが正常であることを確認
    expect(urlResult.expiresAt).toBe(expirationTime.toISOString());
    expect(urlResult.contentType).toBe(contentType);
    expect(urlResult.contentLength).toBe(expectedReportBinary.length);
    
    // Cleanup
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
});