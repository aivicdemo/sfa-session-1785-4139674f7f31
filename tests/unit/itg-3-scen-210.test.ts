import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去成功パターンの条件項目照合', () => {
  // SCEN-210
  test('過去成功パターンの複数条件項目がすべて照合対象として正常に処理される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        業種: 0.95,
        企業規模: 0.88,
        課題キーワード: 0.92,
      }),
    };

    const successPatternMaster = [
      {
        patternId: 'PAT-001',
        conditionItems: [
          { itemKey: '業種', itemValue: '製造業' },
          { itemKey: '企業規模', itemValue: '1000名以上' },
          { itemKey: '課題キーワード', itemValue: 'DX推進' },
        ],
        successCount: 15,
        createdAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const newCaseInput = {
      customerId: 'CUST-NEW-001',
      industry: '製造業',
      companySize: '1000名以上',
      issueKeyword: 'DX推進',
      dealStage: 'initial_proposal',
    };

    const result = await generateRecommendation(
      newCaseInput,
      successPatternMaster,
      mockAIEngine
    );

    expect(result.patternMatchDetails).toEqual({
      業種: 0.95,
      企業規模: 0.88,
      課題キーワード: 0.92,
    });

    expect(result.matchedItemCount).toBe(3);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'PAT-001',
        conditionItems: expect.arrayContaining([
          expect.objectContaining({ itemKey: '業種', itemValue: '製造業' }),
          expect.objectContaining({
            itemKey: '企業規模',
            itemValue: '1000名以上',
          }),
          expect.objectContaining({
            itemKey: '課題キーワード',
            itemValue: 'DX推進',
          }),
        ]),
      }),
      expect.objectContaining({
        industry: '製造業',
        companySize: '1000名以上',
        issueKeyword: 'DX推進',
      })
    );

    expect(result.patternMatchDetails['業種']).toBe(0.95);
    expect(result.patternMatchDetails['企業規模']).toBe(0.88);
    expect(result.patternMatchDetails['課題キーワード']).toBe(0.92);

    expect(result.recommendedApproach).toBeDefined();
    expect(typeof result.recommendedApproach).toBe('string');
  });
});