import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件への提案アプローチを推奨', () => {
  // SCEN-2057
  test('新規案件の担当者経験年数が欠落しているとき、他条件でマッチングが行われる', async () => {
    // 新規案件データ（担当者経験年数は未定義）
    const newDealCondition = {
      customerIndustry: '製造業',
      dealSize: 5000000,
      decisionPeriodDays: 90,
      salesPersonExperienceYears: null,
    };

    // 過去成功パターン3件
    const pastSuccessPatterns = [
      {
        patternId: 'pattern-001',
        customerIndustry: '製造業',
        dealSize: 6000000,
        decisionPeriodDays: 75,
        salesPersonExperienceYears: 5,
        proposalApproach: '設備投資向け提案',
        successRate: 0.85,
      },
      {
        patternId: 'pattern-002',
        customerIndustry: '製造業',
        dealSize: 6000000,
        decisionPeriodDays: 75,
        salesPersonExperienceYears: 3,
        proposalApproach: '業務効率化提案',
        successRate: 0.82,
      },
      {
        patternId: 'pattern-003',
        customerIndustry: '製造業',
        dealSize: 6000000,
        decisionPeriodDays: 75,
        salesPersonExperienceYears: 7,
        proposalApproach: 'ROI重視提案',
        successRate: 0.88,
      },
    ];

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((query: any) => {
        // クエリに担当者経験年数が含まれていないことを確認
        expect(query).not.toHaveProperty('salesPersonExperienceYears');
        expect(query).toHaveProperty('customerIndustry', '製造業');
        expect(query).toHaveProperty('dealSize', 5000000);
        expect(query).toHaveProperty('decisionPeriodDays', 90);
        return Promise.resolve(pastSuccessPatterns);
      }),
      generateRecommendation: jest.fn((condition: any, patterns: any[]) =>
        Promise.resolve({
          recommendedApproaches: [
            '設備投資向け提案',
            '業務効率化提案',
            'ROI重視提案',
          ],
          matchingConditionsList: [
            'customerIndustry',
            'dealSize',
            'decisionPeriodDays',
          ],
          foundPatterns: patterns,
          confidenceScore: 87,
        })
      ),
      explainRecommendationReasoning: jest.fn((recommendation: any) =>
        Promise.resolve(
          '新規案件は過去3件の成功事例と以下の条件でマッチしました: ' +
            '顧客業種（製造業）、案件規模（500万円以上）、決定期間（3ヶ月以内）。 ' +
            '担当者経験年数は条件に含まれていません。'
        )
      ),
    };

    // generateRecommendationを実行
    const recommendation = await generateRecommendation(
      newDealCondition,
      mockAIEngine
    );

    // 推奨結果の検証
    expect(recommendation).toBeDefined();
    expect(recommendation.matchingConditionsList).toContain('customerIndustry');
    expect(recommendation.matchingConditionsList).toContain('dealSize');
    expect(recommendation.matchingConditionsList).toContain('decisionPeriodDays');
    expect(recommendation.matchingConditionsList).not.toContain(
      'salesPersonExperienceYears'
    );
    expect(recommendation.matchingConditionsList.length).toBe(3);

    // 根拠となった過去成功パターンが含まれていることを確認
    expect(recommendation.foundPatterns).toHaveLength(3);
    expect(recommendation.foundPatterns[0].patternId).toBe('pattern-001');
    expect(recommendation.foundPatterns[1].patternId).toBe('pattern-002');
    expect(recommendation.foundPatterns[2].patternId).toBe('pattern-003');

    // 信頼度スコアの検証（0～100）
    expect(recommendation.confidenceScore).toBe(87);

    // explainRecommendationReasoningで根拠説明を取得
    const explanation = await explainRecommendationReasoning(recommendation);
    expect(explanation).toBeDefined();
    expect(explanation).toMatch(/担当者経験年数は条件に含まれていません/);

    // スタブメソッドが正しく呼ばれたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});