import { analyzeProposalAgainstStandardProcess } from "../../src/logic/it-1-br-2-1-1";

describe("提案内容と顧客対応パターンの標準プロセス比較分析", () => {
  test("SCEN-657: 提案内容が標準プロセスと一致する場合、異常パターンが検出されない", () => {
    const proposalData = {
      proposalId: "PROP-657-001",
      customerName: "テスト顧客A",
      proposedProduct: "標準パッケージ",
      proposalAmount: 500000,
      proposalDateTime: new Date("2024-01-15T00:00:00Z"),
      customerContactPattern: ["初回訪問", "提案資料提示", "見積提出"],
    };

    const standardProcessDefinition = {
      processSteps: ["初回訪問", "提案資料提示", "見積提出", "交渉", "成約"],
      requiredSequence: ["初回訪問", "提案資料提示", "見積提出"],
      allowedDeviationRate: 0.1,
    };

    const analysisResult = analyzeProposalAgainstStandardProcess(
      proposalData,
      standardProcessDefinition
    );

    expect(analysisResult.isAnomalyDetected).toBe(false);
    expect(analysisResult.detectedAnomalyPatternCount).toBe(0);
    expect(analysisResult.warningMessage).toBe("なし");
    expect(analysisResult.proposalId).toBe("PROP-657-001");
    expect(analysisResult.complianceStatus).toBe("完全一致");
  });
});