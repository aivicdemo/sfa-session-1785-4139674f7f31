import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2018
  test('経営層向け説得資料の自動生成機能 - リスク要因リストが1件のとき、その1件がリスク列に記載される', () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalId: 'PROP-2024-001',
        recommendedApproach: 'AI導入による自動化推進',
        confidenceScore: 85,
        riskFactors: [
          {
            id: 'RISK-001',
            category: '市場リスク',
            description: '競合他社の参入',
            impact: '高'
          }
        ],
        investmentROI: {
          estimatedCost: 5000000,
          expectedBenefit: 15000000,
          paybackMonths: 12
        },
        successPatternId: 'PATTERN-MFG-001'
      })
    };

    // 顧客情報を定義
    const customerInfo = {
      customerId: 'CUST-2024-001',
      companyName: '山田製造株式会社',
      industry: '製造業',
      companySize: '中堅企業',
      businessChallenge: '生産効率化',
      annualRevenue: 2000000000,
      employeeCount: 250
    };

    // 提案内容を定義
    const proposalContent = {
      proposalId: 'PROP-2024-001',
      proposalTitle: 'AI導入による自動化ソリューション',
      proposalDescription: '既存生産ラインにAI制御システムを導入し、自動化レベルを向上させる',
      implementationTimeline: 12,
      estimatedCost: 5000000,
      managementObjectives: ['生産効率20%向上', 'コスト削減15%', 'リードタイム短縮'],
      budgetConstraint: 6000000,
      scheduleConstraint: 18
    };

    // Act: 経営層向け説得資料を生成
    const persuasionMaterial = generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockRecommendationEngine
    );

    // Assert: 生成された説得資料の構造を検証
    expect(persuasionMaterial).toBeDefined();
    expect(persuasionMaterial.riskAnalysis).toBeDefined();
    expect(persuasionMaterial.riskAnalysis.riskFactors).toBeDefined();
    expect(Array.isArray(persuasionMaterial.riskAnalysis.riskFactors)).toBe(true);

    // リスク要因の件数を検証
    expect(persuasionMaterial.riskAnalysis.riskFactors.length).toBe(1);

    // リスク要因の詳細内容を検証
    const actualRiskFactor = persuasionMaterial.riskAnalysis.riskFactors[0];
    expect(actualRiskFactor.id).toBe('RISK-001');
    expect(actualRiskFactor.category).toBe('市場リスク');
    expect(actualRiskFactor.description).toBe('競合他社の参入');
    expect(actualRiskFactor.impact).toBe('高');
  });
});