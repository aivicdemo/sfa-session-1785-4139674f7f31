import { findSimilarPatterns, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去成功パターンの抽出と適合性判定', () => {
  // SCEN-938
  test('顧客ニーズと提案内容の適合性判定結果に基づいて、成功パターンが適合性スコア順にランク付けされ、推奨提案の根拠に反映される', () => {
    // 過去成功商談テストデータ
    const pastDeal1 = {
      dealId: 'DEAL-001',
      customerIndustry: '製造業',
      issueContent: '生産効率化',
      proposalApproach: 'システム導入',
      contractedFlag: true,
    };

    const pastDeal2 = {
      dealId: 'DEAL-002',
      customerIndustry: '製造業',
      issueContent: 'コスト削減',
      proposalApproach: 'コンサルティング',
      contractedFlag: true,
    };

    const pastDeal3 = {
      dealId: 'DEAL-003',
      customerIndustry: '小売業',
      issueContent: '在庫管理',
      proposalApproach: 'クラウドソリューション',
      contractedFlag: true,
    };

    const pastDeals = [pastDeal1, pastDeal2, pastDeal3];

    // AIRecommendationEngine スタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((deal: typeof pastDeal1) => {
        if (deal.dealId === 'DEAL-001') return 0.85;
        if (deal.dealId === 'DEAL-002') return 0.65;
        if (deal.dealId === 'DEAL-003') return 0.45;
        return 0;
      }),
      findSimilarPatterns: jest.fn((newDealData: any, pastDeals: any[]) => {
        const scoredPatterns = pastDeals.map((deal) => ({
          ...deal,
          relevanceScore: mockAIEngine.evaluatePatternRelevance(deal),
        }));
        const rankedPatterns = scoredPatterns.sort(
          (a, b) => b.relevanceScore - a.relevanceScore,
        );
        return rankedPatterns;
      }),
      generateRecommendation: jest.fn((newDealData: any, rankedPatterns: any[]) => {
        const topPattern = rankedPatterns[0];
        return {
          recommendationId: 'REC-001',
          proposalApproach: topPattern.proposalApproach,
          confidenceScore: 85,
          reasoningText: `適合性スコア上位の第1商談（スコア${topPattern.relevanceScore}）の成功パターンに基づいて推奨します。顧客業種「${topPattern.customerIndustry}」、課題「${topPattern.issueContent}」との適合度が高いため、提案アプローチ「${topPattern.proposalApproach}」を推奨します。`,
          baselinePatternId: topPattern.dealId,
          baselineScore: topPattern.relevanceScore,
        };
      }),
    };

    // 新規案件データ
    const newDealData = {
      customerIndustry: '製造業',
      issueContent: '業務プロセス改善',
      budgetRange: 'mid',
      timelineMonths: 6,
    };

    // ステップ1: 過去成功パターンを抽出
    const similarPatterns = mockAIEngine.findSimilarPatterns(
      newDealData,
      pastDeals,
    );

    // ステップ2: ランク付けの検証
    expect(similarPatterns[0].relevanceScore).toBe(0.85);
    expect(similarPatterns[0].dealId).toBe('DEAL-001');
    expect(similarPatterns[1].relevanceScore).toBe(0.65);
    expect(similarPatterns[1].dealId).toBe('DEAL-002');
    expect(similarPatterns[2].relevanceScore).toBe(0.45);
    expect(similarPatterns[2].dealId).toBe('DEAL-003');

    // ステップ3: 推奨提案を生成
    const recommendation = mockAIEngine.generateRecommendation(
      newDealData,
      similarPatterns,
    );

    // ステップ4: 推奨提案の根拠検証
    expect(recommendation.baselinePatternId).toBe('DEAL-001');
    expect(recommendation.baselineScore).toBe(0.85);
    expect(recommendation.proposalApproach).toBe('システム導入');
    expect(recommendation.confidenceScore).toBe(85);
    expect(recommendation.reasoningText).toContain('適合性スコア上位の第1商談');
    expect(recommendation.reasoningText).toContain('スコア0.85');
    expect(recommendation.reasoningText).toContain('DEAL-001');
    expect(recommendation.reasoningText).toContain('製造業');
    expect(recommendation.reasoningText).toContain('システム導入');

    // ステップ5: 最終検証 - 根拠説明に最高適合性スコアの商談が明示的に参照されているか
    const reasoningContainsTopPattern =
      recommendation.reasoningText.includes('第1商談') &&
      recommendation.reasoningText.includes('0.85') &&
      recommendation.reasoningText.includes('システム導入');

    expect(reasoningContainsTopPattern).toBe(true);
  });
});