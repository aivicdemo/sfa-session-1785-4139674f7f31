import { recommendGuidanceStrategy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  test('SCEN-465: スコアが低水準（21～40点）の場合、「重点指導」が推奨される', () => {
    // スタブ: AIRecommendationEngineのモック実装
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedStrategy: '重点指導',
        scoreLevel: 'low',
        scoreRange: '21-40',
        reasoning: '低スコア案件への集中的な支援が必要です。営業担当者の成約率向上を優先的にサポートしてください。',
        patternFromMaster: {
          patternId: 'GUIDANCE_INTENSIVE_001',
          patternName: '重点指導パターン',
          description: '成績が低迷している営業担当者に対する集中的な指導と支援',
          focusArea: ['提案精度の向上', '顧客ニーズ把握の強化', 'プロセス標準化の徹底'],
          actionItems: [
            '週次フォローアップミーティングの実施',
            'ベストプラクティス事例の共有',
            'ロールプレイングによる提案スキル向上'
          ],
          supportLevel: 'intensive'
        }
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 95,
        applicable: true
      })
    };

    // テスト用の案件データ
    const testCaseData = {
      salesPersonId: 'SP001',
      performanceScore: 30,
      employeeName: 'test_salesperson',
      departmentId: 'DEPT001',
      currentMonth: '2024-01',
      evaluationPeriod: 'monthly',
      previousScores: [28, 25, 32, 29],
      successPatternMatches: 2,
      failurePatternMatches: 8
    };

    // 推奨施策の生成を実行
    const result = recommendGuidanceStrategy(testCaseData, mockAIRecommendationEngine);

    // AIRecommendationEngineが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 推奨施策が「重点指導」であることを確認
    expect(result.recommendedStrategy).toBe('重点指導');

    // スコアレベルが低水準であることを確認
    expect(result.scoreLevel).toBe('low');
    expect(result.scoreRange).toBe('21-40');

    // 根拠情報が正しく返されていることを確認
    expect(result.reasoning).toContain('低スコア案件への集中的な支援が必要');

    // 推奨パターンマスタから統計的に上位の重点指導パターンが適用されていることを確認
    expect(result.patternFromMaster).toBeDefined();
    expect(result.patternFromMaster.patternId).toBe('GUIDANCE_INTENSIVE_001');
    expect(result.patternFromMaster.patternName).toBe('重点指導パターン');
    expect(result.patternFromMaster.supportLevel).toBe('intensive');

    // アクションアイテムが含まれていることを確認
    expect(result.patternFromMaster.actionItems).toHaveLength(3);
    expect(result.patternFromMaster.actionItems).toContain('週次フォローアップミーティングの実施');
    expect(result.patternFromMaster.actionItems).toContain('ベストプラクティス事例の共有');
    expect(result.patternFromMaster.actionItems).toContain('ロールプレイングによる提案スキル向上');

    // 適用可能性スコアが高い値（95点）であることを確認
    expect(result.relevanceScore).toBe(95);
    expect(result.applicable).toBe(true);

    // 結果オブジェクトの構造が期待通りであることを確認
    expect(result).toHaveProperty('recommendedStrategy');
    expect(result).toHaveProperty('scoreLevel');
    expect(result).toHaveProperty('scoreRange');
    expect(result).toHaveProperty('reasoning');
    expect(result).toHaveProperty('patternFromMaster');
    expect(result).toHaveProperty('relevanceScore');
    expect(result).toHaveProperty('applicable');
  });
});