import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2753
  test('テスト対象期間の開始日と終了日が同日のとき、該当する成功パターンのみが抽出される', () => {
    // テスト用の成功パターンデータベース
    const successPatterns = [
      {
        id: 'pattern-a',
        contractDate: new Date('2024-01-15T00:00:00Z'),
        customerIndustry: 'IT',
        dealAmount: 100000,
        approach: 'approach-a',
      },
      {
        id: 'pattern-b',
        contractDate: new Date('2024-01-15T00:00:00Z'),
        customerIndustry: 'Finance',
        dealAmount: 150000,
        approach: 'approach-b',
      },
      {
        id: 'pattern-c',
        contractDate: new Date('2024-01-16T00:00:00Z'),
        customerIndustry: 'Retail',
        dealAmount: 80000,
        approach: 'approach-c',
      },
      {
        id: 'pattern-d',
        contractDate: new Date('2024-01-14T00:00:00Z'),
        customerIndustry: 'Manufacturing',
        dealAmount: 120000,
        approach: 'approach-d',
      },
    ];

    // AIRecommendationEngineのfindSimilarPatternsメソッドをスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(successPatterns),
    };

    // テスト対象期間の開始日と終了日を同日に設定
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-15T23:59:59Z');

    // 成功パターン抽出・照合機能を呼び出し
    const result = extractSuccessPatterns({
      startDate,
      endDate,
      aiEngine: mockAIEngine,
      allPatterns: successPatterns,
    });

    // 抽出結果の件数を確認
    expect(result.patterns).toHaveLength(2);

    // 抽出されたパターンの各レコードについて、成約日が2024-01-15であることを検証
    result.patterns.forEach((pattern) => {
      expect(pattern.contractDate.toISOString()).toMatch(/^2024-01-15/);
    });

    // 抽出結果にパターンAとパターンBが含まれていることを確認
    const extractedIds = result.patterns.map((p) => p.id);
    expect(extractedIds).toContain('pattern-a');
    expect(extractedIds).toContain('pattern-b');

    // 抽出結果にパターンCとパターンDが含まれていないことを確認
    expect(extractedIds).not.toContain('pattern-c');
    expect(extractedIds).not.toContain('pattern-d');
  });
});