import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2854
  test('[normal] 推奨内容の根拠説明文生成機能 - AIエージェントが正常応答した場合、推奨内容の根拠が営業担当者向けの自然言語で説明文として生成される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の生産効率化課題に対するシステム導入提案',
        evidenceData: {
          similarCasesCount: 42,
          conversionRate: 85,
          productivityGain: 15,
          industryType: '製造業',
          companyScale: '中堅企業',
          timeframeLookback: '3年間',
        },
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'この顧客は生産効率化を重視する製造業企業です。過去の同規模・同業界案件では、当社のシステム導入による月産効率15%向上の実績が評価され、成約に至っています。今回も同じアプローチで提案することで高い成約可能性が見込めます',
      ),
    };

    const dealInfo = {
      customerId: 'CUST-20240115-001',
      customerScale: '中堅企業',
      industry: '製造業',
      dealStage: '提案準備',
      budgetRange: '500万円〜1000万円',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    const evidenceData = {
      similarCasesCount: 42,
      conversionRate: 85,
      productivityGain: 15,
      industryType: '製造業',
      companyScale: '中堅企業',
      timeframeLookback: '3年間',
    };

    const recommendedApproach =
      '顧客の生産効率化課題に対するシステム導入提案';

    const generatedExplanation =
      explainRecommendationReasoning(dealInfo, evidenceData, recommendedApproach, mockAIRecommendationEngine);

    expect(generatedExplanation).toBeDefined();
    expect(typeof generatedExplanation).toBe('string');
    expect(generatedExplanation.length).toBeGreaterThan(0);

    expect(generatedExplanation).toMatch(/生産効率化/);
    expect(generatedExplanation).toMatch(/製造業/);
    expect(generatedExplanation).toMatch(/中堅企業/);

    expect(generatedExplanation).toMatch(/15%/);
    expect(generatedExplanation).toMatch(/85%/);

    expect(generatedExplanation).toMatch(/成約可能性/);

    const hasExcessiveTechnicalTerms =
      /モデル|アルゴリズム|機械学習|ニューラル|確率|統計的有意|標準偏差/.test(
        generatedExplanation,
      );
    expect(hasExcessiveTechnicalTerms).toBe(false);

    expect(generatedExplanation).toMatch(/この顧客は/);
    expect(generatedExplanation).toMatch(/過去の/);
    expect(generatedExplanation).toMatch(/成約に/);
    expect(generatedExplanation).toMatch(/見込め/);

    const isPlainJapanese = /[^\u0020-\u007E\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3000-\u303F\uFF01-\uFF9E、。・ー〜]/g.test(
      generatedExplanation,
    );
    expect(isPlainJapanese).toBe(false);
  });
});