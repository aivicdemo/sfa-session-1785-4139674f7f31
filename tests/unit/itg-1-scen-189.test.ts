import { convertProcessStandardToRequirements } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-189
  test("プロセス標準書がドラフト段階のとき、要件仕様変換がエラーになる", () => {
    const draftProcessStandard = {
      id: "std-001",
      name: "営業プロセス標準書",
      status: "DRAFT",
      version: 1,
      stages: [
        {
          stageId: "stage-1",
          stageName: "初回接触",
          description: "顧客との初接触を行う",
        },
        {
          stageId: "stage-2",
          stageName: "提案",
          description: "顧客に提案を実施する",
        },
      ],
      createdAt: "2024-01-15T09:00:00Z",
      approvedAt: null,
    };

    expect(() => convertProcessStandardToRequirements(draftProcessStandard)).toThrow(
      /確定状態/
    );
  });
});