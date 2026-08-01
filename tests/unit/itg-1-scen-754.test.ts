import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-754: 行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書と成約実績の相関係数が正の高い値である指標が優先される", () => {
    const indicators = [
      {
        id: "A",
        name: "初回接触～提案までの日数",
        correlationCoefficient: 0.72,
      },
      {
        id: "B",
        name: "提案～成約までの日数",
        correlationCoefficient: 0.68,
      },
      {
        id: "C",
        name: "顧客ニーズ聞き取り実施率",
        correlationCoefficient: 0.45,
      },
    ];

    const result = selectAnalysisIndicators(indicators);

    expect(result).toEqual([
      {
        priority: 1,
        id: "A",
        name: "初回接触～提案までの日数",
        correlationCoefficient: 0.72,
      },
      {
        priority: 2,
        id: "B",
        name: "提案～成約までの日数",
        correlationCoefficient: 0.68,
      },
      {
        priority: 3,
        id: "C",
        name: "顧客ニーズ聞き取り実施率",
        correlationCoefficient: 0.45,
      },
    ]);
  });
});