import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1579: 根拠の参照元データが存在しないとき、エラーが発生する', async () => {
    // Setup: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '推奨の根拠説明',
        referenceIds: ['REF-00001'],
      }),
    };

    // 推奨パターンマスタとレポートファイルメタデータの欠落状態をシミュレート
    // (REF-00001 に対応するレコードが存在しない)
    const nonExistentRefId = 'REF-00001';

    // テスト実行: 存在しない参照元データIDで根拠表示APIを呼び出し
    try {
      const result = await explainRecommendationReasoning(
        {
          recommendationId: 'REC-12345',
          referenceDataId: nonExistentRefId,
        },
        mockAIEngine
      );

      // 期待結果に到達しなかった場合は失敗
      fail('エラーがスローされるべきです');
    } catch (error: any) {
      // エラーが発生することを検証
      expect(error.code).toBe('DATA_SOURCE_NOT_FOUND');
      expect(error.message).toMatch(/指定された根拠の参照元データが見つかりません/);
      expect(error.message).toMatch(/REF-00001/);
      expect(error.statusCode).toBe(404);

      // システムログに期待されるメッセージが記録されていることを検証
      // (ログ記録の実装詳細に応じてモック確認)
      expect(error.logMessage).toMatch(/根拠表示失敗: 参照元データ欠落/);
      expect(error.logMessage).toMatch(/refId=REF-00001/);
    }
  });
});