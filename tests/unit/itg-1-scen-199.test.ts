import { analyzeActionPatterns } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-199
  test("[normal] 営業担当者行動パターン分析・改善指導対象判定機能 - 営業担当者の行動パターン分析結果が重複データを含む場合、一意に集計される", () => {
    const employeeId = "EMP001";
    const analysisInputData = [
      {
        employeeId: "EMP001",
        activityDate: "2024-01-15",
        activityType: "visit",
        customerId: "CUST_C",
        dealAmount: 5000000,
      },
      {
        employeeId: "EMP001",
        activityDate: "2024-01-15",
        activityType: "visit",
        customerId: "CUST_C",
        dealAmount: 5000000,
      },
    ];

    const result = analyzeActionPatterns({
      employeeId,
      activities: analysisInputData,
    });

    expect(result.visitCount).toBe(1);
    expect(result.dealCount).toBe(1);
    expect(result.totalDealAmount).toBe(5000000);

    const uniqueRecords = result.records.filter(
      (record, index, self) =>
        self.findIndex(
          (r) =>
            r.activityDate === record.activityDate &&
            r.activityType === record.activityType &&
            r.customerId === record.customerId &&
            r.dealAmount === record.dealAmount
        ) === index
    );

    expect(uniqueRecords.length).toBe(1);
    expect(result.records.length).toBe(1);

    const visitRecord = result.records[0];
    expect(visitRecord.activityDate).toBe("2024-01-15");
    expect(visitRecord.activityType).toBe("visit");
    expect(visitRecord.customerId).toBe("CUST_C");
    expect(visitRecord.dealAmount).toBe(5000000);
  });
});