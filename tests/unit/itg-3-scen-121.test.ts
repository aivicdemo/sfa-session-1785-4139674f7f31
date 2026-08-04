import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 商談マスタ存在確認', () => {
  test('SCEN-121: 商談マスタに存在しない商談IDが与えられた場合に推論が実行されない', () => {
    // テスト対象のAIエージェント推奨支援システムを初期化する
    const nonexistentDealId = 'NONEXISTENT-999999';

    // AIRecommendationEngineのスタブを設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 商談マスタデータベース（存在しない商談IDの場合）
    const dealMasterDatabase: Record<string, { dealId: string; customerName: string }> = {
      'DEAL-001': { dealId: 'DEAL-001', customerName: 'Customer A' },
      'DEAL-002': { dealId: 'DEAL-002', customerName: 'Customer B' },
    };

    // 推奨支援システムのメイン処理に、存在しない商談IDを入力パラメータとして渡す
    const result = generateRecommendation(
      nonexistentDealId,
      mockAIRecommendationEngine,
      dealMasterDatabase
    );

    // 期待結果の検証

    // AIRecommendationEngineのメソッドが呼び出されていないことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // システムがエラーコード'ERR_DEALID_NOT_FOUND'を返却することを確認
    expect(result.errorCode).toBe('ERR_DEALID_NOT_FOUND');

    // ユーザーに表示するエラーメッセージを確認
    expect(result.errorMessage).toMatch(/指定された商談ID/);
    expect(result.errorMessage).toMatch(/マスタに存在しません/);

    // 推奨内容が生成されていないことを確認
    expect(result.recommendation).toBeUndefined();

    // キャッシュされた過去推奨の代替表示が行われていないことを確認
    expect(result.cachedFallback).toBeUndefined();
  });
});