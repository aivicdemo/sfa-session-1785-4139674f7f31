import { analyzeProposalPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案パターン分析', () => {
  test('SCEN-2219: 複数件の提案内容が全件標準プロセスと比較される', () => {
    // 標準プロセスマスタデータ定義
    const standardProcessMaster = {
      stages: [
        {
          stageName: 'initial_contact',
          expectedActions: ['customer_need_discovery', 'company_profile_sharing'],
          expectedDuration: 7,
        },
        {
          stageName: 'proposal',
          expectedActions: ['proposal_presentation', 'roi_calculation'],
          expectedDuration: 14,
        },
        {
          stageName: 'negotiation',
          expectedActions: ['price_adjustment', 'contract_review'],
          expectedDuration: 10,
        },
      ],
    };

    // テストデータ: 3件の異なる提案内容
    const proposalDatasetA = {
      proposalId: 'PROP-001',
      customerId: 'CUST-0001',
      industry: 'manufacturing',
      companySize: 'large',
      proposalDate: '2024-06-15T09:00:00Z',
      proposalContent: 'production_optimization_solution',
      actionsTaken: [
        'customer_need_discovery',
        'company_profile_sharing',
        'proposal_presentation',
      ],
      daysElapsed: 8,
    };

    const proposalDatasetB = {
      proposalId: 'PROP-002',
      customerId: 'CUST-0001',
      industry: 'manufacturing',
      companySize: 'large',
      proposalDate: '2024-06-22T10:30:00Z',
      proposalContent: 'supply_chain_digitalization',
      actionsTaken: ['proposal_presentation', 'custom_demo'],
      daysElapsed: 5,
    };

    const proposalDatasetC = {
      proposalId: 'PROP-003',
      customerId: 'CUST-0001',
      industry: 'manufacturing',
      companySize: 'large',
      proposalDate: '2024-07-01T14:00:00Z',
      proposalContent: 'cost_reduction_initiative',
      actionsTaken: [
        'customer_need_discovery',
        'proposal_presentation',
        'roi_calculation',
        'price_adjustment',
      ],
      daysElapsed: 12,
    };

    // AIRecommendationEngineのスタブ定義
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest
        .fn()
        .mockImplementation((proposalData) => {
          const mockSimilarPatterns: Record<
            string,
            { patternId: string; similarityScore: number }[]
          > = {
            'PROP-001': [
              { patternId: 'PATTERN-A001', similarityScore: 0.82 },
              { patternId: 'PATTERN-A002', similarityScore: 0.71 },
            ],
            'PROP-002': [
              { patternId: 'PATTERN-B001', similarityScore: 0.65 },
            ],
            'PROP-003': [
              { patternId: 'PATTERN-C001', similarityScore: 0.88 },
              { patternId: 'PATTERN-C002', similarityScore: 0.75 },
            ],
          };
          return (
            mockSimilarPatterns[proposalData.proposalId] ||
            ({ patternId: 'PATTERN-UNKNOWN', similarityScore: 0 })
          );
        }),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((proposalData, patterns) => {
          const mockRelevanceScores: Record<string, number> = {
            'PROP-001': 82,
            'PROP-002': 65,
            'PROP-003': 88,
          };
          return mockRelevanceScores[proposalData.proposalId] || 0;
        }),
    };

    // 複数提案の一括分析実行
    const analysisResults = analyzeProposalPatterns(
      [proposalDatasetA, proposalDatasetB, proposalDatasetC],
      standardProcessMaster,
      aiRecommendationEngineStub
    );

    // 検証: 3件すべての提案が分析されたことを確認
    expect(analysisResults).toHaveLength(3);

    // 提案Aの分析結果検証
    expect(analysisResults[0]).toEqual({
      proposalId: 'PROP-001',
      matchingScore: 82,
      recommendedPattern: 'PATTERN-A001',
      similarPatterns: [
        { patternId: 'PATTERN-A001', similarityScore: 0.82 },
        { patternId: 'PATTERN-A002', similarityScore: 0.71 },
      ],
      deviationFromStandard: {
        stageMisalignment: 1,
        unexpectedActions: [],
        timeDeviation: 1,
      },
      improvementSuggestions: [
        'roi_calculation should be included in proposal stage',
      ],
    });

    // 提案Bの分析結果検証
    expect(analysisResults[1]).toEqual({
      proposalId: 'PROP-002',
      matchingScore: 65,
      recommendedPattern: 'PATTERN-B001',
      similarPatterns: [{ patternId: 'PATTERN-B001', similarityScore: 0.65 }],
      deviationFromStandard: {
        stageMisalignment: 2,
        unexpectedActions: ['custom_demo'],
        timeDeviation: -2,
      },
      improvementSuggestions: [
        'customer_need_discovery should precede proposal_presentation',
        'add roi_calculation step',
      ],
    });

    // 提案Cの分析結果検証
    expect(analysisResults[2]).toEqual({
      proposalId: 'PROP-003',
      matchingScore: 88,
      recommendedPattern: 'PATTERN-C001',
      similarPatterns: [
        { patternId: 'PATTERN-C001', similarityScore: 0.88 },
        { patternId: 'PATTERN-C002', similarityScore: 0.75 },
      ],
      deviationFromStandard: {
        stageMisalignment: 0,
        unexpectedActions: [],
        timeDeviation: 2,
      },
      improvementSuggestions: ['timeline is 2 days longer than standard process'],
    });

    // AIエージェント呼び出し確認
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledTimes(
      3
    );
    expect(
      aiRecommendationEngineStub.evaluatePatternRelevance
    ).toHaveBeenCalledTimes(3);

    // 各提案が独立して処理されたことを確認
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenNthCalledWith(
      1,
      proposalDatasetA
    );
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenNthCalledWith(
      2,
      proposalDatasetB
    );
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenNthCalledWith(
      3,
      proposalDatasetC
    );

    // 結果画面表示可能性確認: 各提案ごとに異なるマッチングスコアが独立して表示される
    const scoreSetA = new Set([
      analysisResults[0].matchingScore,
      analysisResults[1].matchingScore,
      analysisResults[2].matchingScore,
    ]);
    expect(scoreSetA.size).toBe(3);
    expect(scoreSetA).toEqual(new Set([82, 65, 88]));

    // 結果画面に必須要素が全て含まれていることを確認
    analysisResults.forEach((result) => {
      expect(result).toHaveProperty('proposalId');
      expect(result).toHaveProperty('matchingScore');
      expect(result).toHaveProperty('recommendedPattern');
      expect(result).toHaveProperty('deviationFromStandard');
      expect(result).toHaveProperty('improvementSuggestions');
      expect(result.matchingScore).toBeGreaterThanOrEqual(0);
      expect(result.matchingScore).toBeLessThanOrEqual(100);
      expect(result.improvementSuggestions).toBeInstanceOf(Array);
      expect(result.improvementSuggestions.length).toBeGreaterThan(0);
    });
  });
});