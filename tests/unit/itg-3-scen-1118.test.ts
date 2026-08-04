import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1118
  test('推奨レポート生成・保存機能 - ダウンロードURL生成時の有効期限が0秒のとき、エラーになる', () => {
    const reportKey = 'test-report-123';
    const expirationSeconds = 0;

    expect(() => {
      generateDownloadUrl(reportKey, expirationSeconds);
    }).toThrow(/expirationSeconds|有効期限/);
  });
});