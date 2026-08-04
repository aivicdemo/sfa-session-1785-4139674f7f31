import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: 類似成功パターン検索機能', () => {
  test('SCEN-245: 商談条件がnullのときバリデーションエラーをスロー', () => {
    // 新規案件オブジェクトを作成し、商談条件をnullに設定
    const newDealWithNullConditions = {
      customerId: 'CUST-001',
      dealName: '新規提案案件',
      dealConditions: null as any,
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    // AIRecommendationEngineをスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    // 商談条件がnullのとき、バリデーションエラーをスロー
    expect(() =>
      findSimilarPatterns(newDealWithNullConditions, mockAIEngine)
    ).toThrow(/dealConditions|商談条件/);

    // スタブ化されたAIエンジンのメソッドが呼び出されていないことを確認
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});