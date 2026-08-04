import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  // SCEN-2531
  test("成功要因に同値が並んでいるとき、1つにまとめられる", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { factor: "顧客規模", value: "大企業", frequency: 3 },
        { factor: "顧客規模", value: "大企業", frequency: 3 },
        { factor: "提案手法", value: "オンボーディング支援", frequency: 2 },
        { factor: "提案手法", value: "オンボーディング支援", frequency: 2 },
        { factor: "導入期間", value: "3ヶ月以内", frequency: 2 },
      ]),
    };

    const input = {
      customerSize: "大企業",
      proposalApproach: "オンボーディング支援",
      implementationDays: 90,
    };

    const result = extractSuccessPatterns(input, mockAIEngine);

    expect(result).toEqual([
      { factor: "顧客規模", value: "大企業", frequency: 3 },
      { factor: "提案手法", value: "オンボーディング支援", frequency: 2 },
      { factor: "導入期間", value: "3ヶ月以内", frequency: 2 },
    ]);
  });
});