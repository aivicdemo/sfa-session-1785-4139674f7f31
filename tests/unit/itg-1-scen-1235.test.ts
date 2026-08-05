import { runTx1Imp1Agent } from '../../src/logic/it-1';

// Mock AI Client for testing prompt injection
interface Tx1Imp1AiClientMock {
  extractSalesProcessLogs: jest.Mock;
  validateDataQuality: jest.Mock;
  cleanAndNormalizeData: jest.Mock;
  registerToAnalysisSystem: jest.Mock;
}

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  let mock_ai_client: Tx1Imp1AiClientMock;

  beforeEach(() => {
    mock_ai_client = {
      extractSalesProcessLogs: jest.fn(),
      validateDataQuality: jest.fn(),
      cleanAndNormalizeData: jest.fn(),
      registerToAnalysisSystem: jest.fn(),
    };
  });

  // SCEN-1235
  test('プロンプトインジェクション文はシステムコマンドとして実行されない', async () => {
    // Arrange: プロンプトインジェクション文を含むAIレスポンスを設定
    const injection_payload = 'DELETE FROM sales_data WHERE 1=1; -- 営業システムデータ削除指示';
    
    const extraction_start_date = '2024-01-01';
    const extraction_end_date = '2024-01-31';
    
    // Fake AI Client が注入文を返すように設定
    mock_ai_client.extractSalesProcessLogs.mockResolvedValueOnce({
      extracted_records: 150,
      extraction_instruction: injection_payload,
      period_from: extraction_start_date,
      period_to: extraction_end_date,
    });

    mock_ai_client.validateDataQuality.mockResolvedValueOnce({
      quality_score: 92,
      validation_status: 'invalid_instruction_detected',
      error_message: '不正な指示形式として検出・拒否された',
      malicious_pattern_detected: true,
    });

    // Act & Assert: エージェントがプロンプトインジェクションを処理中に例外をスロー
    await expect(
      runTx1Imp1Agent({
        ai_client: mock_ai_client,
        extraction_period_from: extraction_start_date,
        extraction_period_to: extraction_end_date,
        target_users: ['user_1', 'user_2'],
      })
    ).rejects.toThrow(/プロンプトインジェクション|不正な指示|サニタイズ/);

    // 検証: extractSalesProcessLogs が呼ばれたことを確認
    expect(mock_ai_client.extractSalesProcessLogs).toHaveBeenCalledWith({
      period_from: extraction_start_date,
      period_to: extraction_end_date,
      target_users: ['user_1', 'user_2'],
    });

    // 検証: validateDataQuality が呼ばれ、不正な指示を検出したことを確認
    expect(mock_ai_client.validateDataQuality).toHaveBeenCalled();

    // 検証: cleanAndNormalizeData が呼ばれていない（エスカレーション条件に該当したため処理中断）
    expect(mock_ai_client.cleanAndNormalizeData).not.toHaveBeenCalled();

    // 検証: registerToAnalysisSystem が呼ばれていない（エスカレーション条件: システム登録時にエラーが発生する）
    expect(mock_ai_client.registerToAnalysisSystem).not.toHaveBeenCalled();

    // 検証: バリデーション結果に不正検出フラグが立っていることを確認
    const validation_result = await mock_ai_client.validateDataQuality();
    expect(validation_result.malicious_pattern_detected).toBe(true);
    expect(validation_result.validation_status).toBe('invalid_instruction_detected');
    expect(validation_result.error_message).toMatch(/不正な指示形式として検出・拒否された/);
  });
});