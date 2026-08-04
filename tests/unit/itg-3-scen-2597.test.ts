import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2597
  test('商談条件の契約金額が成功パターン条件と一致する場合、判定基準が正しく適用される', () => {
    const successPatternMaster = {
      patternId: 'SUCCESS_001',
      contractAmountMin: 5000000,
      contractAmountMax: 10000000,
      industry: '製造業',
      description: '契約金額500万円以上1000万円未満'
    };

    const newDealCondition = {
      customerName: 'テスト商社A',
      contractAmount: 7500000,
      industry: '製造業'
    };

    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.95,
        isApplicable: true,
        reasoningExplanation: '新規案件の契約金額750万円は成功パターンの契約金額条件範囲内（500万円以上1000万円未満）に該当するため、このパターンの提案アプローチが適用可能です'
      })
    };

    const result = evaluatePatternRelevance(
      successPatternMaster,
      newDealCondition,
      aiEngineStub
    );

    expect(result.matchedPatternId).toBe('SUCCESS_001');
    expect(result.matchStatus).toBe('適用可能');
    expect(result.applicabilityScore).toBe(0.95);
    expect(result.reasoningExplanation).toBe(
      '新規案件の契約金額750万円は成功パターンの契約金額条件範囲内（500万円以上1000万円未満）に該当するため、このパターンの提案アプローチが適用可能です'
    );
    expect(result.patternDescription).toBe('契約金額500万円以上1000万円未満');
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      successPatternMaster,
      newDealCondition
    );
  });
});