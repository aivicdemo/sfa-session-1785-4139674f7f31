import { evaluateProposalProcessDeviation } from "../../src/logic/it-1-br-3-1-1-1";

// Mock for AIRecommendationEngine
interface AIRecommendationEngineStub {
  evaluatePatternRelevance: jest.Mock;
}

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2177
  test("[edge] 提案プロセス乖離度の数値化 - 標準プロセス定義データが複数件のとき、提案内容が全ての標準プロセスと個別に照合される", () => {
    // Arrange
    const standardProcesses = [
      {
        processId: "PROC-A",
        processName: "プロセスA",
        description: "初期ヒアリング重視型",
      },
      {
        processId: "PROC-B",
        processName: "プロセスB",
        description: "ROI分析重視型",
      },
      {
        processId: "PROC-C",
        processName: "プロセスC",
        description: "導入支援重視型",
      },
    ];

    const proposalContent = {
      customerIndustry: "製造業",
      issue: "生産効率化",
      budget: 5000000,
    };

    const mockAIEngine: AIRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce({ score: 0.85, processId: "PROC-A" })
        .mockReturnValueOnce({ score: 0.62, processId: "PROC-B" })
        .mockReturnValueOnce({ score: 0.78, processId: "PROC-C" }),
    };

    // Act
    const result = evaluateProposalProcessDeviation(
      standardProcesses,
      proposalContent,
      mockAIEngine
    );

    // Assert
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      "PROC-A",
      proposalContent
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      "PROC-B",
      proposalContent
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      "PROC-C",
      proposalContent
    );

    expect(result).toEqual([
      {
        processId: "PROC-A",
        deviationScore: 0.85,
      },
      {
        processId: "PROC-B",
        deviationScore: 0.62,
      },
      {
        processId: "PROC-C",
        deviationScore: 0.78,
      },
    ]);

    expect(result[0].deviationScore).toBe(0.85);
    expect(result[1].deviationScore).toBe(0.62);
    expect(result[2].deviationScore).toBe(0.78);
    expect(result.length).toBe(3);
  });
});