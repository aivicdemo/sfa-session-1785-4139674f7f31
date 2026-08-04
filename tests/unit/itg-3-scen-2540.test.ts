import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能 - 閾値直上パターン除外検証', () => {
  // SCEN-2540
  test('成功要因スコアが閾値直上のステップに紐づくパターンが除外される', async () => {
    // テストデータ準備
    const dealInfo = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealStage: 'proposal',
      dealAmount: 5000000,
      dealTimeline: 90,
      dealContext: {
        currentStep: 'proposal',
        stepProgressions: [
          {
            step: 'initial_contact',
            completedAt: '2024-01-10T09:00:00Z',
            successFactorScore: 0.85,
          },
          {
            step: 'needs_analysis',
            completedAt: '2024-01-15T14:30:00Z',
            successFactorScore: 0.70, // 閾値直上（0.70）
          },
          {
            step: 'proposal',
            completedAt: null,
            successFactorScore: 0.60,
          },
        ],
      },
    };

    const successPatternMasterData = [
      {
        patternId: 'PAT-001',
        stepName: 'initial_contact',
        successFactor: 'early_engagement',
        minimumRelevanceScore: 0.75,
        patternDescription: 'Early engagement pattern',
      },
      {
        patternId: 'PAT-002',
        stepName: 'needs_analysis',
        successFactor: 'thorough_discovery',
        minimumRelevanceScore: 0.75,
        patternDescription: 'Thorough needs analysis pattern',
      },
      {
        patternId: 'PAT-003',
        stepName: 'proposal',
        successFactor: 'customized_solution',
        minimumRelevanceScore: 0.75,
        patternDescription: 'Customized proposal pattern',
      },
    ];

    // AIRecommendationEngineスタブの作成
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockImplementation((patternId: string, dealContext: any) => {
        // 各パターンのスコアを返す
        if (patternId === 'PAT-001') {
          return Promise.resolve(0.85); // 閾値以上
        }
        if (patternId === 'PAT-002') {
          return Promise.resolve(0.70); // 閾値直上 → 除外対象
        }
        if (patternId === 'PAT-003') {
          return Promise.resolve(0.60); // 閾値未満
        }
        return Promise.resolve(0);
      }),
    };

    // 成功パターン抽出・構造化機能を実行
    const extractedPatterns = await evaluatePatternRelevance(
      dealInfo,
      successPatternMasterData,
      mockAIEngine,
      0.75 // 最小関連度スコア閾値
    );

    // 期待結果の検証
    // 1. 抽出結果にPAT-002（スコア0.70）が含まれていないことを確認
    const includedPatternIds = extractedPatterns.map((p: any) => p.patternId);
    expect(includedPatternIds).not.toContain('PAT-002');

    // 2. PAT-001（スコア0.85）は抽出結果に含まれることを確認
    expect(includedPatternIds).toContain('PAT-001');

    // 3. PAT-003（スコア0.60）も抽出結果に含まれないことを確認
    expect(includedPatternIds).not.toContain('PAT-003');

    // 4. 抽出パターンの数を確認
    expect(extractedPatterns).toHaveLength(1);

    // 5. 抽出されたパターンがPAT-001であることを確認
    expect(extractedPatterns[0]).toEqual(
      expect.objectContaining({
        patternId: 'PAT-001',
        stepName: 'initial_contact',
        successFactor: 'early_engagement',
        relevanceScore: 0.85,
      })
    );

    // 6. evaluatePatternRelevanceが各パターンに対して呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});