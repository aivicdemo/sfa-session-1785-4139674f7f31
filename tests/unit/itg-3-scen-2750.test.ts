import { evaluateRecommendationEligibility } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 過去商談データ0件時の推奨ロジック検証', () => {
  // SCEN-2750
  test('過去商談データが0件のとき、推奨ロジック検証が実行不可と判定される', () => {
    // テストデータ: 対象顧客の過去商談データが0件
    const customerId = 'CUST-00001';
    const pastDealCount = 0;
    const newDealCondition = {
      customerId: customerId,
      dealAmount: 5000000,
      industry: 'manufacturing',
      companySize: 'large',
      dealStage: 'initial_contact',
    };

    // AIRecommendationEngineのスタブを定義
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタの参照をモック化（呼び出されないことを検証）
    const mockPatternRepository = {
      queryByCustomerAndIndustry: jest.fn(),
    };

    // 推奨ロジック検証の実行可否を判定する関数を呼び出す
    const result = evaluateRecommendationEligibility(
      customerId,
      pastDealCount,
      newDealCondition,
      mockAIEngine,
      mockPatternRepository
    );

    // 期待結果: ステータスが『PATTERN_EVALUATION_DISABLED』
    expect(result.status).toBe('PATTERN_EVALUATION_DISABLED');

    // 判定理由に過去成功パターン0件メッセージが含まれる
    expect(result.reason).toMatch(/過去成功パターンが0件/);
    expect(result.reason).toMatch(/パターン関連性スコアリング/);

    // AIRecommendationEngineの各メソッドが呼び出されていないこと
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // 推奨パターンマスタが参照されていないこと
    expect(mockPatternRepository.queryByCustomerAndIndustry).not.toHaveBeenCalled();

    // 実行可否フラグが false
    expect(result.isEligible).toBe(false);
  });
});