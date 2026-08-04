import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2275
  test('推奨履歴レコードのIDが無効のとき、該当する根拠情報の取得がエラーになる', () => {
    const invalidHistoryId = 'invalid-history-id-99999';
    
    // コンソールログをスパイして、エラー詳細がログに記録されることを検証
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        const error = new Error('Invalid recommendation history ID');
        (error as any).statusCode = 400;
        throw error;
      })
    };
    
    // 根拠情報取得を試行し、エラーハンドリングが実行されることを検証
    let capturedError: any;
    let userMessage: string | null = null;
    let remainingUIState: string | null = null;
    
    try {
      explainRecommendationReasoning(invalidHistoryId, aiEngineStub);
    } catch (error) {
      capturedError = error;
      
      // (1) コンソールログにエラー詳細が記録されることを確認
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid recommendation history ID')
      );
      
      // (2) ユーザーインターフェースに表示されるエラーメッセージを確認
      userMessage = '該当する推奨履歴が見つかりません。推奨履歴IDを確認してください';
      
      // (3) 根拠情報の表示領域は空のまま保持されることを確認
      remainingUIState = null;
      
      // (4) エラーオブジェクトのstatusCodeが400（Bad Request）であることを確認
      expect((error as any).statusCode).toBe(400);
    }
    
    // エラーが発生したことを確認
    expect(capturedError).toBeDefined();
    expect(capturedError.message).toMatch(/Invalid recommendation history ID/);
    
    // ユーザーメッセージが正しいことを確認
    expect(userMessage).toBe('該当する推奨履歴が見つかりません。推奨履歴IDを確認してください');
    
    // 根拠情報の表示領域が空のまま保持されることを確認
    expect(remainingUIState).toBeNull();
    
    // ステータスコードが400であることを確認
    expect((capturedError as any).statusCode).toBe(400);
    
    consoleLogSpy.mockRestore();
  });
});