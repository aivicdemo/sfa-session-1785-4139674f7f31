import { generateExecutivePersuasionMaterial } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1977: 経営層向け説得資料の自動生成機能 - AIエージェント呼び出し成功時に生成された根拠情報が説得資料の各要素に正確に組み込まれる", async () => {
    // AIRecommendationEngine のスタブ構成
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "クラウドベースのDXソリューション導入によるプロセス効率化",
        successPatternRationale: "同業種の3社で平均45%の業務効率化を実現した事例に基づく推奨",
        roiCalculationRationale: "初期投資850万円、年間運用費300万円、3年間での削減効果2500万円",
        riskMitigationRationale: "段階的導入（Phase1: 基盤構築3ヶ月、Phase2: 機能拡張2ヶ月）により導入リスクを最小化",
        confidenceScore: 87,
        recommendationId: "REC-2024-001-A",
        aiModelVersion: "GPT-4-turbo-2024-05"
      })
    };

    // テスト用の顧客情報と提案内容
    const customerInfo = {
      customerName: "テック企業A",
      industry: "情報通信業",
      annualRevenue: 50000,
      managementChallenge: "営業プロセスの属人化解消と効率化"
    };

    const proposalContent = {
      proposalSolution: "クラウドベースのDXソリューション",
      implementationPeriod: 5,
      cost: 8500000
    };

    // 説得資料の自動生成処理を実行
    const generatedMaterial = await generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockAIEngine
    );

    // 生成された説得資料の構造を検証
    expect(generatedMaterial).toHaveProperty("executiveSummary");
    expect(generatedMaterial).toHaveProperty("proposalBackground");
    expect(generatedMaterial).toHaveProperty("businessImpact");
    expect(generatedMaterial).toHaveProperty("implementationFramework");
    expect(generatedMaterial).toHaveProperty("investmentEffectiveness");

    // 提案アプローチが『提案背景』セクションに正確に組み込まれていることを検証
    expect(generatedMaterial.proposalBackground).toContain(
      "クラウドベースのDXソリューション導入によるプロセス効率化"
    );

    // 成功パターン根拠が『ビジネスインパクト』セクションに正確に組み込まれていることを検証
    expect(generatedMaterial.businessImpact).toContain(
      "同業種の3社で平均45%の業務効率化を実現した事例に基づく推奨"
    );

    // ROI計算根拠が『投資対効果』セクションに正確に組み込まれていることを検証
    expect(generatedMaterial.investmentEffectiveness).toContain(
      "初期投資850万円"
    );
    expect(generatedMaterial.investmentEffectiveness).toContain(
      "年間運用費300万円"
    );
    expect(generatedMaterial.investmentEffectiveness).toContain(
      "3年間での削減効果2500万円"
    );

    // リスク対応根拠が『導入体制』セクションに正確に組み込まれていることを検証
    expect(generatedMaterial.implementationFramework).toContain(
      "段階的導入"
    );
    expect(generatedMaterial.implementationFramework).toContain(
      "Phase1: 基盤構築3ヶ月"
    );
    expect(generatedMaterial.implementationFramework).toContain(
      "Phase2: 機能拡張2ヶ月"
    );

    // 根拠情報が生成前後で変更されていないことを文字列比較で確認
    expect(generatedMaterial.proposalBackground).toBe(
      "提案背景: クラウドベースのDXソリューション導入によるプロセス効率化"
    );
    expect(generatedMaterial.businessImpact).toBe(
      "ビジネスインパクト: 同業種の3社で平均45%の業務効率化を実現した事例に基づく推奨"
    );
    expect(generatedMaterial.investmentEffectiveness).toBe(
      "投資対効果: 初期投資850万円、年間運用費300万円、3年間での削減効果2500万円"
    );
    expect(generatedMaterial.implementationFramework).toBe(
      "導入体制: 段階的導入（Phase1: 基盤構築3ヶ月、Phase2: 機能拡張2ヶ月）によるリスク最小化"
    );

    // 生成されたJSON形式資料にメタデータが付与されていることを確認
    expect(generatedMaterial).toHaveProperty("metadata");
    expect(generatedMaterial.metadata).toHaveProperty("generatedAt");
    expect(generatedMaterial.metadata).toHaveProperty("rationale_id");
    expect(generatedMaterial.metadata).toHaveProperty("aiModelVersion");

    // メタデータの値が正確であることを確認
    expect(generatedMaterial.metadata.rationale_id).toBe("REC-2024-001-A");
    expect(generatedMaterial.metadata.aiModelVersion).toBe(
      "GPT-4-turbo-2024-05"
    );

    // 生成日時が ISO 8601 形式であることを確認
    expect(generatedMaterial.metadata.generatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    );

    // AIエージェントの呼び出しが正確に行われたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      proposalContent
    );

    // 資料の形式がJSON対応オブジェクトであることを確認
    expect(typeof generatedMaterial).toBe("object");
    expect(generatedMaterial).not.toBeNull();
  });
});