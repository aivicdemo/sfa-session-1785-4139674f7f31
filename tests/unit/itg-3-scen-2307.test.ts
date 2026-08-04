import { compareWithStandardProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2307: 顧客対応記録の時系列が逆順のとき正しく時系列並べ替えされて比較される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue({
        standardProcessSteps: [
          {
            stepNumber: 1,
            stepName: '初期接触',
            timestamp: new Date('2024-01-05T09:00:00Z'),
          },
          {
            stepNumber: 2,
            stepName: 'ニーズヒアリング',
            timestamp: new Date('2024-01-10T10:30:00Z'),
          },
          {
            stepNumber: 3,
            stepName: '提案実行',
            timestamp: new Date('2024-01-15T14:00:00Z'),
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const reversedRecords = [
      {
        recordId: 'A',
        actionType: '提案実行',
        timestamp: new Date('2024-01-15T14:00:00Z'),
        description: '提案資料を顧客に提示',
      },
      {
        recordId: 'B',
        actionType: 'ニーズヒアリング',
        timestamp: new Date('2024-01-10T10:30:00Z'),
        description: '顧客の課題をヒアリング',
      },
      {
        recordId: 'C',
        actionType: '初期接触',
        timestamp: new Date('2024-01-05T09:00:00Z'),
        description: '顧客初回訪問',
      },
    ];

    const comparisonResult = compareWithStandardProcess(
      reversedRecords,
      mockAIRecommendationEngine
    );

    expect(comparisonResult.mappedRecords).toEqual([
      {
        recordId: 'C',
        actionType: '初期接触',
        timestamp: new Date('2024-01-05T09:00:00Z'),
        description: '顧客初回訪問',
      },
      {
        recordId: 'B',
        actionType: 'ニーズヒアリング',
        timestamp: new Date('2024-01-10T10:30:00Z'),
        description: '顧客の課題をヒアリング',
      },
      {
        recordId: 'A',
        actionType: '提案実行',
        timestamp: new Date('2024-01-15T14:00:00Z'),
        description: '提案資料を顧客に提示',
      },
    ]);

    expect(comparisonResult.deviationSummary).toBe(
      '3件全て標準プロセスステップ順序に一致'
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        records: expect.arrayContaining([
          expect.objectContaining({ recordId: 'C' }),
          expect.objectContaining({ recordId: 'B' }),
          expect.objectContaining({ recordId: 'A' }),
        ]),
      })
    );
  });
});