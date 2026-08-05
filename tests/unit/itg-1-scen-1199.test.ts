import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1199: [error] AI推論精度監視機能 - AI推論ログが null のとき処理がエラーになる
  test('should throw TypeError or return 400 error when AI inference log is null', async () => {
    const nullInferenceLog = null;

    try {
      await monitorAiInferenceAccuracy(nullInferenceLog);
      fail('Expected an error to be thrown');
    } catch (error) {
      if (error instanceof TypeError) {
        expect(error.message).toMatch(/AI推論ログが無効です|AI推論ログの形式が不正です/);
      } else if (error instanceof Error) {
        expect(error.message).toMatch(/AI推論ログが無効です|AI推論ログの形式が不正です/);
      } else {
        throw error;
      }
    }
  });
});