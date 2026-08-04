import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 推奨生成のレスポンスバリデーション', () => {
  test('SCEN-123: APIレスポンスに必須フィールドが欠けている場合にエラーになる', () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        object: 'recommendation',
        recommendation: '提案アプローチA',
        confidence: 0.95
        // 必須フィールド 'reasoning' が欠けている
      })
    };

    // テスト対象の入力パラメータ
    const customerId = 'CUST-001';
    const dealCondition = {
      dealType: '新規案件',
      budget: 5000000
    };

    // Act & Assert: エラーがスローされることを確認
    expect(async () => {
      await generateRecommendation(customerId, dealCondition, mockAIEngine);
    }).rejects.toThrow(/reasoning/);

    // Assert: エラーオブジェクトの詳細を検証
    generateRecommendation(customerId, dealCondition, mockAIEngine).catch(
      (error: any) => {
        expect(error.code).toBe('INVALID_RESPONSE_SCHEMA');
        expect(error.message).toMatch(/必須フィールド/);
        expect(error.message).toMatch(/reasoning/);
      }
    );
  });
});