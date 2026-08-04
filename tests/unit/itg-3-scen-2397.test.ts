import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能 - 成功パターン抽出データがnullのとき', () => {
  test('SCEN-2397: 成功パターン抽出データがnullの場合、PatternDataNullErrorをthrowする', () => {
    // 入力: 成功パターン抽出データがnull、新規案件データ（顧客ID: TEST-001、商談条件: 標準パッケージ、業界: IT）
    const newCaseData = {
      customerId: 'TEST-001',
      dealCondition: '標準パッケージ',
      industry: 'IT',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    // 期待結果: PatternDataNullErrorをthrowし、エラーメッセージに指定テキストを含む
    expect(() => {
      evaluatePatternRelevance(newCaseData, mockAIEngine);
    }).toThrow(/成功パターン抽出データ/);
  });
});