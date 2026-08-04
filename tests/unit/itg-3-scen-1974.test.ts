import { generatePersuasionMaterialForExecutives } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料の自動生成", () => {
  test("SCEN-1974: 生成された説得資料に改善提案が正確に含まれる", () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        executiveSummary: {
          title: "製造業向けシステムA導入による生産効率化提案",
          overview:
            "生産効率化の経営課題に対し、システムAの導入により年間生産性30%向上を実現します。",
        },
        customerAnalysis: {
          industry: "製造業",
          annualRevenue: "100億円",
          currentChallenge: "生産効率化",
          challengeContext:
            "現在の生産ラインは手作業が多く、生産効率が低下している。市場競争力維持のため生産性向上が急務。",
        },
        proposalAnalysis: {
          systemName: "システムA",
          investmentAmount: 50000000,
          currencyUnit: "JPY",
          proposedContent: "自動化システム導入と運用サポート",
          expectedEffect: "生産性30%向上により年間効果1億5000万円",
        },
        roiCalculation: {
          investmentAmount: 50000000,
          annualEffectAmount: 150000000,
          paybackPeriodYears: 4,
          roi: 200,
          roiPercentage: 200,
        },
        competitiveAdvantage: [
          "業界平均より高い生産効率を実現し、市場競争力を強化",
          "納期短縮により顧客満足度向上",
          "コスト削減で利益率改善",
        ],
        riskMitigation: [
          {
            riskType: "導入期間のダウンタイム",
            mitigationStrategy:
              "段階的な導入により既存ラインの稼働を維持しながら新システム運用",
            estimatedImpactReduction: 80,
          },
          {
            riskType: "従業員の適応課題",
            mitigationStrategy: "包括的な研修プログラムと専任サポートチーム配置",
            estimatedImpactReduction: 90,
          },
          {
            riskType: "技術的課題",
            mitigationStrategy: "ベンダーによる保守契約とホットラインサポート",
            estimatedImpactReduction: 95,
          },
        ],
        marketOpportunity:
          "グローバル市場での競争激化に対応し、製造業界でのコストリーダーシップを確立",
      }),
    };

    // Input: 顧客情報と提案内容
    const customerInfo = {
      industry: "製造業",
      annualRevenue: "100億円",
      currentChallenge: "生産効率化",
    };

    const proposalContent = {
      systemName: "システムA",
      investmentAmount: 50000000,
      expectedEffect: "生産性30%向上",
    };

    // Act: 説得資料自動生成機能を実行
    const persuasionMaterial = generatePersuasionMaterialForExecutives(
      customerInfo,
      proposalContent,
      mockAIRecommendationEngine
    );

    // Assert: 生成された説得資料の構造と内容を検証

    // ①経営層向けのエグゼクティブサマリーが含まれていることを確認
    expect(persuasionMaterial).toHaveProperty("executiveSummary");
    expect(persuasionMaterial.executiveSummary).toHaveProperty("title");
    expect(persuasionMaterial.executiveSummary).toHaveProperty("overview");
    expect(persuasionMaterial.executiveSummary.title).toBe(
      "製造業向けシステムA導入による生産効率化提案"
    );

    // ②入力した顧客情報と提案内容の関連性が明確に説明されていることを確認
    expect(persuasionMaterial).toHaveProperty("customerAnalysis");
    expect(persuasionMaterial.customerAnalysis.industry).toBe("製造業");
    expect(persuasionMaterial.customerAnalysis.annualRevenue).toBe("100億円");
    expect(persuasionMaterial.customerAnalysis.currentChallenge).toBe(
      "生産効率化"
    );
    expect(persuasionMaterial).toHaveProperty("proposalAnalysis");
    expect(persuasionMaterial.proposalAnalysis.systemName).toBe("システムA");
    expect(persuasionMaterial.proposalAnalysis.investmentAmount).toBe(
      50000000
    );

    // ③定量的なROIが具体的な数値で記載されていることを確認
    expect(persuasionMaterial).toHaveProperty("roiCalculation");
    expect(persuasionMaterial.roiCalculation.investmentAmount).toBe(50000000);
    expect(persuasionMaterial.roiCalculation.annualEffectAmount).toBe(
      150000000
    );
    expect(persuasionMaterial.roiCalculation.paybackPeriodYears).toBe(4);
    expect(persuasionMaterial.roiCalculation.roi).toBe(200);
    expect(persuasionMaterial.roiCalculation.roiPercentage).toBe(200);

    // ④経営層が意思決定するために必要な競争優位性や市場機会のポイントが記載されていることを確認
    expect(persuasionMaterial).toHaveProperty("competitiveAdvantage");
    expect(Array.isArray(persuasionMaterial.competitiveAdvantage)).toBe(true);
    expect(persuasionMaterial.competitiveAdvantage.length).toBeGreaterThan(0);
    expect(persuasionMaterial.competitiveAdvantage).toContain(
      "業界平均より高い生産効率を実現し、市場競争力を強化"
    );
    expect(persuasionMaterial.competitiveAdvantage).toContain(
      "納期短縮により顧客満足度向上"
    );
    expect(persuasionMaterial.competitiveAdvantage).toContain(
      "コスト削減で利益率改善"
    );
    expect(persuasionMaterial).toHaveProperty("marketOpportunity");
    expect(persuasionMaterial.marketOpportunity).toBe(
      "グローバル市場での競争激化に対応し、製造業界でのコストリーダーシップを確立"
    );

    // ⑤提案実施に伴うリスク（導入期間、組織変更等）と対応策が記載されていることを確認
    expect(persuasionMaterial).toHaveProperty("riskMitigation");
    expect(Array.isArray(persuasionMaterial.riskMitigation)).toBe(true);
    expect(persuasionMaterial.riskMitigation.length).toBeGreaterThanOrEqual(3);

    // リスク1: 導入期間のダウンタイム対応
    const downtimeRisk = persuasionMaterial.riskMitigation.find(
      (risk: { riskType: string }) =>
        risk.riskType === "導入期間のダウンタイム"
    );
    expect(downtimeRisk).toBeDefined();
    expect(downtimeRisk.mitigationStrategy).toBe(
      "段階的な導入により既存ラインの稼働を維持しながら新システム運用"
    );
    expect(downtimeRisk.estimatedImpactReduction).toBe(80);

    // リスク2: 従業員の適応課題対応
    const staffAdaptationRisk = persuasionMaterial.riskMitigation.find(
      (risk: { riskType: string }) =>
        risk.riskType === "従業員の適応課題"
    );
    expect(staffAdaptationRisk).toBeDefined();
    expect(staffAdaptationRisk.mitigationStrategy).toBe(
      "包括的な研修プログラムと専任サポートチーム配置"
    );
    expect(staffAdaptationRisk.estimatedImpactReduction).toBe(90);

    // リスク3: 技術的課題対応
    const technicalRisk = persuasionMaterial.riskMitigation.find(
      (risk: { riskType: string }) => risk.riskType === "技術的課題"
    );
    expect(technicalRisk).toBeDefined();
    expect(technicalRisk.mitigationStrategy).toBe(
      "ベンダーによる保守契約とホットラインサポート"
    );
    expect(technicalRisk.estimatedImpactReduction).toBe(95);

    // 全体構造の確認: 必要な要素がすべて過不足なく含まれていることを確認
    const requiredProperties = [
      "executiveSummary",
      "customerAnalysis",
      "proposalAnalysis",
      "roiCalculation",
      "competitiveAdvantage",
      "marketOpportunity",
      "riskMitigation",
    ];
    requiredProperties.forEach((property) => {
      expect(persuasionMaterial).toHaveProperty(property);
    });

    // 顧客情報と提案内容の関連性が正しく反映されていることを確認
    expect(
      persuasionMaterial.customerAnalysis.currentChallenge
    ).toBe("生産効率化");
    expect(persuasionMaterial.proposalAnalysis.investmentAmount).toBe(
      50000000
    );
    expect(persuasionMaterial.roiCalculation.annualEffectAmount).toBe(
      150000000
    );

    // AIエージェントが正しく呼び出されたことを確認
    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "製造業",
        annualRevenue: "100億円",
        currentChallenge: "生産効率化",
      }),
      expect.objectContaining({
        systemName: "システムA",
        investmentAmount: 50000000,
        expectedEffect: "生産性30%向上",
      })
    );
  });
});