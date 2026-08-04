import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1810
  test('[normal] 推奨内容の根拠説明機能 - AIエージェント呼び出し失敗時、簡略版の根拠説明が表示される', async () => {
    // Arrange: AIRecommendationEngine のスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValueOnce(
        new Error('API timeout after 30 seconds')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValueOnce(
        new Error('API timeout after 30 seconds')
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタに統計的に上位の成功パターン3件を格納
    const patternMaster = [
      {
        patternId: 'PAT-001',
        successRate: 85,
        applicableIndustries: ['IT', 'SaaS'],
        description: 'クラウド導入支援パターン',
      },
      {
        patternId: 'PAT-002',
        successRate: 78,
        applicableIndustries: ['IT', 'Manufacturing'],
        description: 'デジタル変革推進パターン',
      },
      {
        patternId: 'PAT-003',
        successRate: 72,
        applicableIndustries: ['IT', 'Finance'],
        description: 'システム最適化パターン',
      },
    ];

    // テスト用の新規案件データ
    const newDealData = {
      customerIndustry: 'IT',
      budget: 5000000,
      implementationPeriod: 3,
      dealConditions: {
        needsCloudMigration: true,
        currentSystemAge: 8,
        teamSize: 45,
      },
    };

    // Act: generateRecommendation() を呼び出し、外部API失敗時の代替動作を確認
    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      patternMaster
    );

    // Assert: 外部API失敗時に代替動作が実行されたことを確認
    expect(result).toBeDefined();
    expect(result.recommendationStatus).toBe('fallback');
    
    // ユーザー向けメッセージが表示されることを確認
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 簡略版の根拠説明が返却されることを確認
    expect(result.simplifiedReasoning).toBeDefined();
    expect(Array.isArray(result.simplifiedReasoning)).toBe(true);
    expect(result.simplifiedReasoning.length).toBe(3);

    // 簡略版根拠説明の内容を検証
    result.simplifiedReasoning.forEach((reasoning, index) => {
      expect(reasoning.patternId).toMatch(/^PAT-00[1-3]$/);
      expect(reasoning.reason).toBe(
        '過去の成功事例から統計的に選定された提案アプローチです'
      );
      expect(reasoning.successRate).toBeUndefined();
      expect(reasoning.detailedExplanation).toBeUndefined();
    });

    // 詳細な自然言語による根拠説明が表示されないことを確認
    expect(result.detailedReasoning).toBeUndefined();
    expect(result.explanationText).toBeUndefined();

    // 統計的に上位のパターンが選定されていることを確認（成功率の高い順）
    expect(result.simplifiedReasoning[0].patternId).toBe('PAT-001');
    expect(result.simplifiedReasoning[1].patternId).toBe('PAT-002');
    expect(result.simplifiedReasoning[2].patternId).toBe('PAT-003');

    // 外部AI呼び出しが失敗したことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});