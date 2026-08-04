import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロード URL 生成', () => {
  // SCEN-994
  test('レポートファイルメタデータが null のとき、URL 生成処理が開始されず警告が返される', () => {
    const s3AdapterStub = {
      putObject: jest.fn(),
      getSignedUrl: jest.fn(),
    };

    const result = generateDownloadUrl(null, s3AdapterStub);

    expect(result).toEqual({
      code: 'METADATA_NULL_ERROR',
      message: 'レポートファイルメタデータが null です。URL生成処理をスキップしました。',
      severity: 'warning',
    });

    expect(s3AdapterStub.putObject).not.toHaveBeenCalled();
    expect(s3AdapterStub.getSignedUrl).not.toHaveBeenCalled();
  });
});