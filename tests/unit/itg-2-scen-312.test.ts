import { determineCoachedStaffPriority } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-312
  test("改善指導優先順位の決定 - スコアが満点の営業担当者が最後の優先度として付与される", () => {
    const staff_members = [
      {
        staff_id: "A",
        staff_name: "営業担当者A",
        process_compliance_score: 100,
      },
      {
        staff_id: "B",
        staff_name: "営業担当者B",
        process_compliance_score: 85,
      },
      {
        staff_id: "C",
        staff_name: "営業担当者C",
        process_compliance_score: 70,
      },
      {
        staff_id: "D",
        staff_name: "営業担当者D",
        process_compliance_score: 60,
      },
    ];

    const result = determineCoachedStaffPriority(staff_members);

    expect(result).toEqual([
      {
        staff_id: "D",
        staff_name: "営業担当者D",
        process_compliance_score: 60,
        coaching_priority_rank: 1,
      },
      {
        staff_id: "C",
        staff_name: "営業担当者C",
        process_compliance_score: 70,
        coaching_priority_rank: 2,
      },
      {
        staff_id: "B",
        staff_name: "営業担当者B",
        process_compliance_score: 85,
        coaching_priority_rank: 3,
      },
      {
        staff_id: "A",
        staff_name: "営業担当者A",
        process_compliance_score: 100,
        coaching_priority_rank: 4,
      },
    ]);
  });
});