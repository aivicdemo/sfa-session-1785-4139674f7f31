import { determineApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-715
  test("成功・失敗要因の抽出と承認基準判定機能 - ワークショップ参加者数が定義された最小値未満のとき、承認基準判定で不適切と判定される", () => {
    const workshopData = {
      workshop_id: "WS-001",
      participant_count: 2,
      min_participant_requirement: 3,
      extracted_success_factors: [
        { factor: "顧客ニーズの理解", frequency: 5 },
        { factor: "提案タイミング", frequency: 4 },
      ],
      extracted_failure_factors: [
        { factor: "フォローアップ不足", frequency: 3 },
      ],
      workshop_date: "2024-01-15T10:00:00Z",
    };

    const result = determineApprovalCriteria(workshopData);

    expect(result.approval_status).toBe("不適切");
    expect(result.reason).toMatch(/ワークショップ参加者数が最小値3名未満です/);
    expect(result.is_approved).toBe(false);
  });
});