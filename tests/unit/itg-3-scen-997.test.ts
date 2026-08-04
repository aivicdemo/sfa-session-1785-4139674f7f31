import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-997: ファイルオブジェクトキーが空文字列のとき、URL生成処理が開始されず警告が返される', () => {
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn(),
    };

    const empty_file_key = '';

    const result = generateDownloadUrl(empty_file_key, mockFileStorageAdapter);

    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();
    expect(result).toEqual({
      code: 'INVALID_FILE_KEY',
      message: 'ファイルオブジェクトキーが空です',
    });
  });
});