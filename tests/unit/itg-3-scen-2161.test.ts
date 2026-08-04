import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロードURL生成エラーハンドリング', () => {
  test('SCEN-2161: 推奨レポートIDがnullのとき、エラーハンドリングが正しく動作する', () => {
    const nullReportId = null;

    expect(() => {
      generateDownloadUrl(nullReportId as any);
    }).toThrow(/推奨レポートID/);
  });
});