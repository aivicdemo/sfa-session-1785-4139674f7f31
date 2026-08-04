import { extractImprovementItems } from '../../src/logic/itg-3';

interface InconsistencyLog {
  logId: string;
  fieldName: string;
  expectedValue: string;
  actualValue: string;
}

interface ImprovementItem {
  fieldName: string;
  logId: string;
  relevanceScore: number;
}

interface AIRecommendationEngineStub {
  evaluatePatternRelevance: (fieldName: string) => number;
}

describe('AIエージェント推奨支援システム - 改善対象項目抽出', () => {
  // SCEN-425
  test('複数件の不整合ログから全対象項目が関連スコアの降順で抽出される', () => {
    const inconsistencyLogs: InconsistencyLog[] = [
      {
        logId: 'L001',
        fieldName: '顧客名',
        expectedValue: '株式会社A',
        actualValue: '株式会社B',
      },
      {
        logId: 'L002',
        fieldName: '提案金額',
        expectedValue: '1000万円',
        actualValue: '900万円',
      },
      {
        logId: 'L003',
        fieldName: 'フォローメール送信日',
        expectedValue: '2026-08-05',
        actualValue: '2026-08-06',
      },
    ];

    const aiRecommendationEngineStub: AIRecommendationEngineStub = {
      evaluatePatternRelevance: (fieldName: string): number => {
        const scoreMap: Record<string, number> = {
          '顧客名': 0.95,
          '提案金額': 0.87,
          'フォローメール送信日': 0.72,
        };
        return scoreMap[fieldName] ?? 0.0;
      },
    };

    const result: ImprovementItem[] = extractImprovementItems(
      inconsistencyLogs,
      aiRecommendationEngineStub
    );

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      fieldName: '顧客名',
      logId: 'L001',
      relevanceScore: 0.95,
    });

    expect(result[1]).toEqual({
      fieldName: '提案金額',
      logId: 'L002',
      relevanceScore: 0.87,
    });

    expect(result[2]).toEqual({
      fieldName: 'フォローメール送信日',
      logId: 'L003',
      relevanceScore: 0.72,
    });

    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(result[1].relevanceScore).toBeGreaterThan(result[2].relevanceScore);
  });
});