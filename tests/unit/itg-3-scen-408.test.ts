import { verifyInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-408: 推論精度検証機能 - OpenAI API正常応答時に推論精度と改善提案を記録', () => {
    // Arrange: AIRecommendationEngineのモック設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        accuracy: 0.87,
        suggestions: [
          '顧客のニーズに基づいた提案内容の強調',
          '過去成功事例との関連性を明記'
        ]
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const newCaseData = {
      caseId: 'CASE-20240115-001',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealCondition: '新規受注',
      executedAt: new Date('2024-01-15T11:00:00Z')
    };

    const expectedRecordedData = {
      caseId: 'CASE-20240115-001',
      accuracyScore: 0.87,
      improvementSuggestions: [
        '顧客のニーズに基づいた提案内容の強調',
        '過去成功事例との関連性を明記'
      ],
      recordedAt: expect.any(Date)
    };

    // Act: 推論精度検証機能を呼び出し
    const result = verifyInferenceAccuracy(newCaseData, mockAIEngine);

    // Assert: AIRecommendationEngineのモックが呼ばれたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: 'CASE-20240115-001',
        customerIndustry: '製造業',
        customerScale: '中堅企業',
        dealCondition: '新規受注'
      })
    );

    // Assert: 推論精度スコアが正確に記録されたことを確認
    expect(result.accuracyScore).toBe(0.87);

    // Assert: 改善提案が正確に記録されたことを確認
    expect(result.improvementSuggestions).toEqual([
      '顧客のニーズに基づいた提案内容の強調',
      '過去成功事例との関連性を明記'
    ]);

    // Assert: 記録されたレコードが必要なすべての要素を含むことを確認
    expect(result).toMatchObject({
      caseId: 'CASE-20240115-001',
      accuracyScore: 0.87,
      improvementSuggestions: expect.arrayContaining([
        '顧客のニーズに基づいた提案内容の強調',
        '過去成功事例との関連性を明記'
      ])
    });

    // Assert: 記録データが後続参照可能な形式で保存されていることを確認
    expect(result).toHaveProperty('caseId');
    expect(result).toHaveProperty('accuracyScore');
    expect(result).toHaveProperty('improvementSuggestions');
    expect(result.improvementSuggestions).toHaveLength(2);
    expect(typeof result.accuracyScore).toBe('number');
    expect(result.accuracyScore).toBeGreaterThanOrEqual(0);
    expect(result.accuracyScore).toBeLessThanOrEqual(1);
  });
});