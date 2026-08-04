import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-582
  test('過去成功事例の参照件数が複数件のときき上位事例から根拠説明に含まれる', () => {
    // Mock の AIRecommendationEngine
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          id: 'case_A',
          correlationScore: 0.95,
          industry: '製造業',
          budgetScale: '5000万円',
          challenge: 'DX推進',
          successFactor: '経営層巻き込み',
          outcome: '成約',
        },
        {
          id: 'case_B',
          correlationScore: 0.87,
          industry: '製造業',
          budgetScale: '3000万円',
          challenge: 'コスト削減',
          successFactor: 'ROI提示',
          outcome: '成約',
        },
        {
          id: 'case_C',
          correlationScore: 0.72,
          industry: '流通業',
          budgetScale: '1000万円',
          challenge: '在庫最適化',
          successFactor: 'パイロット導入',
          outcome: '成約',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanationText: '本件顧客は製造業で、過去成功事例との相関度が高い案件です。最も類似度の高い事例A（相関度0.95）では経営層を巻き込むことで成功しました。次点の事例B（相関度0.87）ではROI提示が有効でした。これらの成功要因を本件にも適用することを推奨します。',
        includedCaseIds: ['case_A', 'case_B'],
        topCasesLimit: 2,
      }),
    };

    const newDealInput = {
      customerId: 'cust_001',
      customerIndustry: '製造業',
      budgetScale: '4500万円',
      mainChallenge: 'DX推進・コスト削減',
      dealStage: '初期接触',
    };

    const recommendationResult = {
      recommendedApproach: '経営層巻き込み + ROI提示',
      confidenceScore: 92,
      reasoning: {
        explanationText: mockAIRecommendationEngine.explainRecommendationReasoning().explanationText,
        includedCaseIds: mockAIRecommendationEngine.explainRecommendationReasoning().includedCaseIds,
        topCasesLimit: mockAIRecommendationEngine.explainRecommendationReasoning().topCasesLimit,
      },
    };

    // 根拠説明文生成機能を実行
    const result = explainRecommendationReasoning(
      newDealInput,
      mockAIRecommendationEngine.findSimilarPatterns(),
      mockAIRecommendationEngine.explainRecommendationReasoning()
    );

    // 期待値の確認：相関度が最も高い上位事例が根拠に含まれていること
    expect(result.includedCaseIds).toContain('case_A');
    expect(result.includedCaseIds).toContain('case_B');
    expect(result.includedCaseIds).not.toContain('case_C');

    // 期待値の確認：上位N件の範囲内のみの事例が含まれていること
    expect(result.includedCaseIds.length).toBe(2);

    // 期待値の確認：説明文に上位事例が記載されていること
    expect(result.explanationText).toContain('事例A');
    expect(result.explanationText).toContain('事例B');
    expect(result.explanationText).not.toContain('事例C');

    // 期待値の確認：相関度スコアが説明文に含まれていること
    expect(result.explanationText).toContain('0.95');
    expect(result.explanationText).toContain('0.87');

    // 期待値の確認：事例が相関度順に提示されていること
    const caseAIndex = result.explanationText.indexOf('事例A');
    const caseBIndex = result.explanationText.indexOf('事例B');
    expect(caseAIndex).toBeLessThan(caseBIndex);

    // 期待値の確認：根拠説明文が存在すること
    expect(result.explanationText).toBeTruthy();
    expect(result.explanationText.length).toBeGreaterThan(0);

    // 期待値の確認：上位N件の制限値が正しく設定されていること
    expect(result.topCasesLimit).toBe(2);
  });
});