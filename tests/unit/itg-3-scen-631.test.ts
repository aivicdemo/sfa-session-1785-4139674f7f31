import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨送信準備機能 - 外部AI推奨エンジンタイムアウト時の代替処理", () => {
  test("SCEN-631: 外部AIエンジンがタイムアウトしたとき、内部推奨パターンマスタから統計的上位パターンが返却される", async () => {
    const newBusinessData = {
      customerIndustry: "製造業",
      dealAmount: 5000000,
      decisionMakers: 3,
    };

    const internalPatternMaster = [
      {
        patternId: "PAT-001",
        successRate: 85,
        frequency: 120,
      },
      {
        patternId: "PAT-002",
        successRate: 78,
        frequency: 95,
      },
      {
        patternId: "PAT-003",
        successRate: 72,
        frequency: 80,
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("External AI timeout"));
          }, 31000);
        });
      }),
    };

    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const result = await generateRecommendation(
      newBusinessData,
      mockAIEngine,
      internalPatternMaster,
      mockLogger,
      30000
    );

    expect(result).toEqual({
      recommendationPatterns: [
        {
          patternId: "PAT-001",
          successRate: 85,
          frequency: 120,
          source: "internal_master",
        },
        {
          patternId: "PAT-002",
          successRate: 78,
          frequency: 95,
          source: "internal_master",
        },
        {
          patternId: "PAT-003",
          successRate: 72,
          frequency: 80,
          source: "internal_master",
        },
      ],
      fallbackReason: "external_ai_timeout",
      explanation: "簡略版の根拠説明テキスト",
      isFromInternalMaster: true,
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "External AI recommendation timed out. Falling back to internal pattern master. Top 3 patterns by success rate returned."
      )
    );
  });
});