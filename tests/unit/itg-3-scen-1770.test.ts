import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1770
  test('根拠説明文に改行を含むとき改行を保持して根拠表示内容を返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '顧客はIT予算が潤沢で\n過去3年の導入実績が豊富な業種です。\n同じ業種の成功事例から、提案アプローチAが最適です。'
      ),
    };

    const recommendationContext = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      proposedApproachId: 'APPROACH-A',
      successPatternId: 'PATTERN-IT-BUDGET-HIGH',
    };

    const result = explainRecommendationReasoning(
      recommendationContext,
      mockAIEngine
    );

    const expectedOutput =
      '顧客はIT予算が潤沢で\n過去3年の導入実績が豊富な業種です。\n同じ業種の成功事例から、提案アプローチAが最適です。';

    expect(result).toBe(expectedOutput);

    const lines = result.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('顧客はIT予算が潤沢で');
    expect(lines[1]).toBe('過去3年の導入実績が豊富な業種です。');
    expect(lines[2]).toBe('同じ業種の成功事例から、提案アプローチAが最適です。');
  });
});