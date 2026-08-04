import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-856
  test("[error] 推奨内容の信頼度スコア算出・根拠提示機能 - 根拠データのタイムスタンプが未来日のとき、エラーで処理が進まない", () => {
    const currentTime = new Date("2024-01-15T11:00:00Z");
    const futureTimestamp = new Date("2024-02-14T11:00:00Z");

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0,
        patterns: [
          {
            id: "pattern-001",
            name: "成功パターン1",
            timestamp: futureTimestamp,
            relevanceDetails: {
              customerIndustry: "IT",
              budget: 5000000,
              matchRate: 0.85,
            },
          },
        ],
      }),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const mockPatternMaster = {
      getTopPatterns: jest.fn().mockReturnValue([
        {
          id: "fallback-pattern-001",
          name: "代替成功パターン",
          trustScore: 75,
          successRate: 0.82,
        },
      ]),
    };

    const customerInput = {
      name: "テスト太郎",
      industry: "IT",
      budget: 5000000,
    };

    expect(() => {
      evaluatePatternRelevance(
        customerInput,
        mockAIEngine,
        mockLogger,
        mockPatternMaster,
        currentTime
      );
    }).toThrow(/タイムスタンプ/);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/根拠データのタイムスタンプが無効です/)
    );
  });
});