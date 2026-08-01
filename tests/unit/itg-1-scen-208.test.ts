import { analyzeActionPatternWithStatusHandling } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-208
  test("営業担当者の行動状態が標準プロセス中止である場合、中止データが集計に含まれるかフィルタされるか", () => {
    const salesPersonId = "SA001";
    const actionRecords = [
      {
        salesPersonId: "SA001",
        actionState: "標準プロセス中止",
        actionCount: 5,
        actionDate: "2024-01-15",
      },
      {
        salesPersonId: "SA001",
        actionState: "初回接触",
        actionCount: 3,
        actionDate: "2024-01-16",
      },
      {
        salesPersonId: "SA001",
        actionState: "提案",
        actionCount: 2,
        actionDate: "2024-01-17",
      },
      {
        salesPersonId: "SA001",
        actionState: "標準プロセス中止",
        actionCount: 4,
        actionDate: "2024-01-18",
      },
    ];

    const result = analyzeActionPatternWithStatusHandling(
      salesPersonId,
      actionRecords
    );

    expect(result).toEqual({
      salesPersonId: "SA001",
      totalRecordCount: 4,
      cancelledRecordCount: 2,
      activeRecordCount: 2,
      totalActionCountIncludingCancelled: 14,
      totalActionCountExcludingCancelled: 5,
      cancelledActionCount: 9,
      includesCancelledStatus: true,
      isFilteredAsPerSpec: true,
    });
  });
});