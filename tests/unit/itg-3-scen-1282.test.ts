import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - 外部AI失敗時の代替パターン返却', () => {
  test('SCEN-1282: 成功パターンが0件の場合に代替パターンが内部マスタから返却される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      industry: 'IT',
      scale: '中規模',
      customerType: 'スタートアップ',
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'PATTERN-001',
          patternName: '初期接触時のニーズ深掘りアプローチ',
          caseCount: 247,
          conversionRate: 68.5,
          source: 'internal_master',
          rationale: '過去実績から最適なアプローチを選択しました',
        }),
      ])
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].rationale).toBe('過去実績から最適なアプローチを選択しました');
  });
});