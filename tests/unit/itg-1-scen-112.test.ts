import { convertProcessToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-112
  test("プロセス標準書のシステム要件変換機能 - プロセス段階の段階番号が欠落している場合、変換処理がエラーになる", () => {
    const processBookData = {
      processId: "PROC-001",
      processName: "営業プロセス標準書",
      stages: [
        {
          stageNumber: 1,
          stageName: "初回接触",
          description: "顧客との最初の接触",
        },
        {
          stageNumber: null,
          stageName: "提案",
          description: "商品・サービスの提案",
        },
        {
          stageNumber: 3,
          stageName: "交渉",
          description: "条件交渉",
        },
      ],
    };

    expect(() => convertProcessToSystemRequirements(processBookData)).toThrow(
      /段階番号/
    );
  });
});