import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2374
  test('顧客対応パターンのマッチ度がちょうど0の場合、非適合として正確に反映される', () => {
    const input = {
      customerIndustry: '製造業',
      dealSize: '中規模',
      proposalApproach: 'コスト削減重視',
      similarCaseScore: 0.0,
    };

    const result = evaluatePatternRelevance(input);

    expect(result.isMatched).toBe(false);
    expect(result.scoreValue).toBe(0.0);
    expect(result.judgmentReason).toBe(
      '顧客対応パターンとの関連性が確認できません。別のアプローチを検討してください'
    );
  });
});