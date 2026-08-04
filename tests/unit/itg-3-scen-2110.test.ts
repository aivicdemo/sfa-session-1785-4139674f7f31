import { describe, test, expect, beforeEach } from "@jest/globals";
import { calculateDeviationFromStandardProcess } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2110
  test("提案内容と標準プロセスの乖離度算出 - 分析対象の商談IDがnullのとき、エラーが発生する", () => {
    const dealId = null;
    const proposalContent = {
      approach: "直接営業",
      timing: "初期接触",
      targetValue: 500000,
    };
    const standardProcessDefinition = {
      stepsSequence: ["初期接触", "ニーズ分析", "提案", "交渉", "成約"],
      expectedApproaches: ["営業電話", "メール", "直接営業"],
      typicalTimingDays: 30,
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      calculateDeviationFromStandardProcess(
        dealId,
        proposalContent,
        standardProcessDefinition,
        aiEngineStub,
        fileStorageStub
      )
    ).toThrow(/商談ID/);

    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(fileStorageStub.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(fileStorageStub.generateDownloadUrl).not.toHaveBeenCalled();
    expect(fileStorageStub.deleteExpiredReports).not.toHaveBeenCalled();
  });
});