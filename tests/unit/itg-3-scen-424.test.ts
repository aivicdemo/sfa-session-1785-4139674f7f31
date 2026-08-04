import { extractImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  test('SCEN-424: 不整合ログが1件の場合、該当項目が正しく抽出される', () => {
    // スタブ設定: AIRecommendationEngineモック
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'パーソナライズされたフォローメール',
        confidenceScore: 85,
        rationale: '30日間の音信不通を解消するため、顧客の課題に応じたパーソナライズされたフォローメールを定期的に送付する運用ルールが必要',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テストデータ: 不整合ログ1件
    const inconsistencyLog = {
      id: 'LOG-001',
      dealPhase: '提案段階',
      description: '提案段階と記録されているが、顧客からの反応がなく30日間音信不通',
      daysSilent: 30,
      detectionTimestamp: new Date('2024-01-15T10:00:00Z'),
    };

    // 改善対象項目抽出機能を呼び出し
    const result = extractImprovementItems([inconsistencyLog], mockAIEngine);

    // AIRecommendationEngineのgenerateRecommendationが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    // 抽出結果の検証
    expect(result).toEqual({
      items: [
        {
          id: expect.any(String),
          title: 'フォローメール（商談後のパーソナライズされた追跡メール）の定期送付ルール化',
          relatedInconsistencyLogId: 'LOG-001',
          rationale: '30日間の音信不通を解消するため、顧客の課題に応じたパーソナライズされたフォローメールを定期的に送付する運用ルールが必要',
          importanceScore: 85,
        },
      ],
      totalCount: 1,
    });

    // 抽出項目が1件のみであることを確認
    expect(result.items).toHaveLength(1);

    // 抽出項目に必須フィールドが含まれていることを確認
    const extractedItem = result.items[0];
    expect(extractedItem).toHaveProperty('relatedInconsistencyLogId');
    expect(extractedItem.relatedInconsistencyLogId).toBe('LOG-001');
    expect(extractedItem).toHaveProperty('rationale');
    expect(extractedItem).toHaveProperty('importanceScore');
    expect(typeof extractedItem.importanceScore).toBe('number');
    expect(extractedItem.importanceScore).toBeGreaterThanOrEqual(0);
    expect(extractedItem.importanceScore).toBeLessThanOrEqual(100);
  });
});