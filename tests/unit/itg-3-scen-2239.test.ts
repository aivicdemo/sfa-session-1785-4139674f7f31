import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠可視化機能', () => {
  // SCEN-2239
  test('推奨根拠の要素が体系的に整理されて可視化される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        summary: '製造業向けの生産効率化ソリューション提案',
        basis: [
          {
            category: '過去成功パターン',
            details: '類似案件3件の事例名：事例A（自動車部品製造）、事例B（電子部品製造）、事例C（精密機械製造）',
            subDetails: [
              { name: '事例A', convictionRate: 92 },
              { name: '事例B', convictionRate: 88 },
              { name: '事例C', convictionRate: 85 }
            ],
            approachOutline: '生産ライン自動化による原価削減と納期短縮を実現',
            score: 90,
            trustLevel: '高'
          },
          {
            category: '顧客課題マッチ度',
            extractedChallenge: '現在の生産ラインの生産性低下と納期遅延',
            recommendedSolution: 'IoT センサー導入と AI 予測保全システムの導入',
            matchScore: 85,
            trustLevel: '高'
          },
          {
            category: '提案タイミング',
            recommendedTiming: '2024年Q2（3月中）',
            reason: '顧客の新年度予算確保のタイミングと、競合の提案準備期間を回避',
            successRateIncrease: 12,
            trustLevel: '中'
          },
          {
            category: '競合対策ポイント',
            differentiationElements: '当社の AI 予測保全技術による 15% のコスト削減実績',
            emphasisPoints: 'ROI 18 ヶ月で実現可能、導入期間 3 ヶ月の短期実装',
            marketAdvantageScore: 78,
            trustLevel: '中'
          }
        ]
      })
    };

    const newProjectInfo = {
      industry: '製造業',
      dealStage: '提案前',
      budgetScale: '5000万円',
      competitorPresence: true
    };

    const result = visualizeRecommendationBasis(newProjectInfo, mockAIRecommendationEngine);

    expect(result).toEqual({
      summary: '製造業向けの生産効率化ソリューション提案',
      structure: [
        {
          level: 1,
          title: '推奨概要',
          content: '製造業向けの生産効率化ソリューション提案',
          expandable: false
        },
        {
          level: 2,
          title: '過去成功パターン',
          content: '類似案件3件の事例名：事例A（自動車部品製造）、事例B（電子部品製造）、事例C（精密機械製造）',
          details: [
            { label: '事例A', value: '受注確度 92%' },
            { label: '事例B', value: '受注確度 88%' },
            { label: '事例C', value: '受注確度 85%' }
          ],
          approachOutline: '生産ライン自動化による原価削減と納期短縮を実現',
          score: 90,
          trustLevel: '高',
          expandable: true,
          expanded: false
        },
        {
          level: 2,
          title: '顧客課題マッチ度',
          extractedChallenge: '現在の生産ラインの生産性低下と納期遅延',
          recommendedSolution: 'IoT センサー導入と AI 予測保全システムの導入',
          matchScore: 85,
          score: 85,
          trustLevel: '高',
          expandable: true,
          expanded: false
        },
        {
          level: 2,
          title: '提案タイミング',
          recommendedTiming: '2024年Q2（3月中）',
          reason: '顧客の新年度予算確保のタイミングと、競合の提案準備期間を回避',
          successRateIncrease: 12,
          score: 0,
          trustLevel: '中',
          expandable: true,
          expanded: false
        },
        {
          level: 2,
          title: '競合対策ポイント',
          differentiationElements: '当社の AI 予測保全技術による 15% のコスト削減実績',
          emphasisPoints: 'ROI 18 ヶ月で実現可能、導入期間 3 ヶ月の短期実装',
          marketAdvantageScore: 78,
          score: 78,
          trustLevel: '中',
          expandable: true,
          expanded: false
        }
      ],
      hierarchicalOrder: ['推奨概要', '過去成功パターン', '顧客課題マッチ度', '提案タイミング', '競合対策ポイント'],
      allElementsHaveTrustIndicator: true
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newProjectInfo);
  });
});