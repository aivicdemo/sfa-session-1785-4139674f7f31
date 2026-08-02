import { extractFailurePatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-841
  test("行動ログデータが存在しないとき、失敗パターンは抽出されない", () => {
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");
    const behaviorLogData: any[] = [];

    const result = extractFailurePatterns({
      behaviorLogs: behaviorLogData,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
    });

    expect(result).toEqual([]);
  });
});