import { generatePersuasionMaterialForExecutives } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2031
  test("経営層向け説得資料生成時、投資対効果（ROI）の端数が小数点第2位で四捨五入される", () => {
    // モック設定: AIRecommendationEngine
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-2031-001",
        customerId: "cust-2031-001",
        proposalContent: "提案内容テスト",
        rationale: {
          pastSuccessPatterns: ["パターンA", "パターンB"],
          customerData: {
            industry: "製造業",
            size: "大企業",
            mainChallenge: "コスト削減"
          },
          successPatternMatch: 85
        },
        investmentEffectiveness: {
          roi: 3.333333333333,
          paybackPeriod: 2.5,
          npv: 1500000.666666
        },
        riskFactors: [],
        recommendedActions: []
      })
    };

    // モック設定: FileStorageAdapter
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: "report-2031-001",
        downloadUrl: "https://s3.example.com/report-2031-001.pdf",
        expiresAt: new Date("2024-12-31T23:59:59Z")
      })
    };

    // テスト入力パラメータ
    const persuasionMaterialInput = {
      recommendationData: {
        recommendationId: "rec-2031-001",
        customerId: "cust-2031-001",
        proposalContent: "提案内容テスト",
        rationale: {
          pastSuccessPatterns: ["パターンA", "パターンB"],
          customerData: {
            industry: "製造業",
            size: "大企業",
            mainChallenge: "コスト削減"
          },
          successPatternMatch: 85
        },
        investmentEffectiveness: {
          roi: 3.333333333333,
          paybackPeriod: 2.5,
          npv: 1500000.666666
        },
        riskFactors: [
          {
            riskId: "risk-001",
            description: "市場変動リスク",
            severity: "medium"
          }
        ],
        recommendedActions: [
          {
            actionId: "action-001",
            description: "段階的な導入を検討"
          }
        ]
      },
      executiveContext: {
        executiveLevel: "C-level",
        decisionDeadline: "2024-12-15T00:00:00Z",
        budgetConstraint: 5000000
      }
    };

    // 関数呼び出し
    const generatedMaterial = generatePersuasionMaterialForExecutives(
      persuasionMaterialInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // 期待結果の検証
    expect(generatedMaterial).toBeDefined();
    expect(generatedMaterial.material).toBeDefined();

    // ROI値の抽出と検証
    const extractedRoi = generatedMaterial.material.investmentEffectiveness.roi;
    
    // ROI値が小数点第2位で四捨五入されている（3.33）ことを確認
    expect(extractedRoi).toBe(3.33);
    expect(typeof extractedRoi).toBe("number");
    
    // 無限小数や桁溢れが発生していないことを確認
    expect(Number.isFinite(extractedRoi)).toBe(true);
    expect(extractedRoi.toString()).toBe("3.33");

    // モックが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 生成資料に必要なフィールドが存在することを確認
    expect(generatedMaterial.material.proposalContent).toBe("提案内容テスト");
    expect(generatedMaterial.material.rationale).toBeDefined();
    expect(generatedMaterial.material.riskFactors).toBeDefined();
    expect(generatedMaterial.material.recommendedActions).toBeDefined();
  });
});