import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-051
  test('OpenAI API呼び出しが失敗した場合に内部マスタから代替検索結果が返される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: '製造業',
      budgetRange: '500万円～1000万円',
      decisionDeadline: '3ヶ月以内',
    };

    let attemptCount = 0;
    mockAIEngine.findSimilarPatterns.mockImplementation(() => {
      attemptCount++;
      if (attemptCount <= 3) {
        throw new Error('OpenAI API failed with status 500');
      }
    });

    const result = await findSimilarPatterns(
      dealCondition,
      mockAIEngine,
      mockFileStorage
    );

    expect(attemptCount).toBe(3);
    expect(result.patterns).toHaveLength(3);
    expect(result.patterns[0]).toEqual({
      patternId: 'PATTERN-001',
      successRate: 0.92,
      description: '製造業向け中規模案件の標準提案パターン',
      briefExplanation: '過去事例から統計的に最も採用率が高い',
      customerIndustry: '製造業',
      budgetRangeMin: 5000000,
      budgetRangeMax: 10000000,
    });
    expect(result.patterns[1]).toEqual({
      patternId: 'PATTERN-002',
      successRate: 0.88,
      description: '中堅製造業の投資効果重視提案',
      briefExplanation: '類似顧客への成功事例ベース',
      customerIndustry: '製造業',
      budgetRangeMin: 5000000,
      budgetRangeMax: 10000000,
    });
    expect(result.patterns[2]).toEqual({
      patternId: 'PATTERN-003',
      successRate: 0.85,
      description: '製造業のコスト削減提案フレームワーク',
      briefExplanation: 'マスタから自動抽出した上位パターン',
      customerIndustry: '製造業',
      budgetRangeMin: 5000000,
      budgetRangeMax: 10000000,
    });
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.source).toBe('fallback_internal_master');
  });
});