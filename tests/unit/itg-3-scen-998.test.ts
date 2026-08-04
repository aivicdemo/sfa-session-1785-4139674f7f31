import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロード URL 生成', () => {
  // SCEN-998
  test('URL有効期限が負数のとき、不正値エラーが返される', () => {
    const reportId = 'report-12345';
    const expirationSeconds = -3600;

    const result = generateDownloadUrl(reportId, expirationSeconds);

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('INVALID_EXPIRATION_TIME');
    expect(result.error?.message).toMatch(/有効期限は正の数値である必要があります/);
    expect(result.url).toBeNull();
  });
});