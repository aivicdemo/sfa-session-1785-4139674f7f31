import { validateAndGenerateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-734: 推奨生成前データ完全性判定機能 - AIRecommendationEngineの呼び出しが3回の再試行後も失敗したとき推奨生成失敗と判定される', async () => {
    // テスト用の顧客情報と商談条件を準備
    const newProjectData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companySize: 'LARGE',
      dealCondition: {
        dealId: 'DEAL-20240115-001',
        dealStage: 'INITIAL_PROPOSAL',
        estimatedAmount: 5000000,
        proposedDate: '2024-01-15',
      },
    };

    // AIRecommendationEngineのモック化
    // 3回すべての呼び出しでタイムアウトエラーを発生させる設定
    const mockAIEngine = {
      callCount: 0,
      generateRecommendation: jest.fn(async () => {
        mockAIEngine.callCount += 1;
        // タイムアウトエラーをシミュレート
        const error = new Error('Request timeout');
        (error as any).code = 'TIMEOUT';
        throw error;
      }),
    };

    // 推奨生成処理を実行
    // AIRecommendationEngineの呼び出しが指数バックオフで最大3回試行される
    const result = await validateAndGenerateRecommendation(
      newProjectData,
      mockAIEngine
    );

    // 推奨生成処理の戻り値を検証
    expect(result.recommendation_status).toBe('GENERATION_FAILED');

    // AIRecommendationEngineへの呼び出し回数が正確に3回であることを確認
    expect(mockAIEngine.callCount).toBe(3);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 推奨内容が存在しないことを確認（フォールバックが実行されていない）
    expect(result.recommendation_content).toBeUndefined();
    expect(result.recommendation_score).toBeUndefined();

    // フォールバック処理が実行されていないことを確認
    expect(result.is_fallback_applied).toBe(false);
  });
});