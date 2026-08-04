import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 複数パターン処理', () => {
  // SCEN-2697
  test('findSimilarPatternsが複数件を返却したとき、すべてが判定対象として処理される', () => {
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'pattern_001',
        relevanceScore: 0.95,
        pastDealData: {
          customerId: 'cust_001',
          industry: 'manufacturing',
          dealAmount: 5000000,
          stage: 'negotiation',
          successIndicators: ['budget_approved', 'stakeholder_aligned'],
        },
      },
      {
        patternId: 'pattern_002',
        relevanceScore: 0.87,
        pastDealData: {
          customerId: 'cust_002',
          industry: 'manufacturing',
          dealAmount: 4500000,
          stage: 'evaluation',
          successIndicators: ['rfi_submitted', 'poc_planned'],
        },
      },
      {
        patternId: 'pattern_003',
        relevanceScore: 0.76,
        pastDealData: {
          customerId: 'cust_003',
          industry: 'manufacturing',
          dealAmount: 3800000,
          stage: 'discovery',
          successIndicators: ['initial_meeting_done'],
        },
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn((pattern) => {
      if (pattern.patternId === 'pattern_001') return 0.95;
      if (pattern.patternId === 'pattern_002') return 0.87;
      if (pattern.patternId === 'pattern_003') return 0.76;
      return 0;
    });

    const mockExplainRecommendationReasoning = jest
      .fn()
      .mockImplementation((patternData) => {
        if (patternData.patternId === 'pattern_001') {
          return '過去事例の成功パターンと96%合致。予算承認済み、ステークホルダー合意が達成されているため、最適なアプローチです。';
        }
        if (patternData.patternId === 'pattern_002') {
          return 'RFI提出済み、POC計画中の段階で、提案資料による評価検証が有効です。';
        }
        if (patternData.patternId === 'pattern_003') {
          return '初期面談完了時点で、顧客ニーズの深掘りと課題背景確認が推奨されます。';
        }
        return '';
      });

    const newDealCondition = {
      customerId: 'cust_new_001',
      industry: 'manufacturing',
      dealAmount: 4700000,
      stage: 'evaluation',
      customerSize: 'large',
    };

    const recommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    const result = generateRecommendation(newDealCondition, recommendationEngine);

    // (1) recommendedPatterns配列に返却件数と同じ要素数3が含まれていることを確認
    expect(result.recommendedPatterns).toHaveLength(3);

    // (2) 各パターンのrelevanceScore、patternId、pastDealDataが保持されていることを確認
    expect(result.recommendedPatterns[0].patternId).toBe('pattern_001');
    expect(result.recommendedPatterns[0].relevanceScore).toBe(0.95);
    expect(result.recommendedPatterns[0].pastDealData.customerId).toBe(
      'cust_001'
    );
    expect(result.recommendedPatterns[0].pastDealData.dealAmount).toBe(5000000);

    expect(result.recommendedPatterns[1].patternId).toBe('pattern_002');
    expect(result.recommendedPatterns[1].relevanceScore).toBe(0.87);
    expect(result.recommendedPatterns[1].pastDealData.customerId).toBe(
      'cust_002'
    );
    expect(result.recommendedPatterns[1].pastDealData.dealAmount).toBe(4500000);

    expect(result.recommendedPatterns[2].patternId).toBe('pattern_003');
    expect(result.recommendedPatterns[2].relevanceScore).toBe(0.76);
    expect(result.recommendedPatterns[2].pastDealData.customerId).toBe(
      'cust_003'
    );
    expect(result.recommendedPatterns[2].pastDealData.dealAmount).toBe(3800000);

    // (3) 評価対象から外される件数が0件であることを確認
    expect(result.excludedPatternCount).toBe(0);

    // (4) explainRecommendationReasoningで全3パターン分の根拠が生成されていることを確認
    expect(result.recommendedPatterns[0].reasoning).toBe(
      '過去事例の成功パターンと96%合致。予算承認済み、ステークホルダー合意が達成されているため、最適なアプローチです。'
    );
    expect(result.recommendedPatterns[1].reasoning).toBe(
      'RFI提出済み、POC計画中の段階で、提案資料による評価検証が有効です。'
    );
    expect(result.recommendedPatterns[2].reasoning).toBe(
      '初期面談完了時点で、顧客ニーズの深掘りと課題背景確認が推奨されます。'
    );

    // findSimilarPatternsが新規案件条件で呼び出されたことを確認
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealCondition);

    // evaluatePatternRelevanceが全3パターン分呼び出されたことを確認
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // explainRecommendationReasoningが全3パターン分呼び出されたことを確認
    expect(mockExplainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});