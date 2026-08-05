import { generateMonthlyAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-504: 月次分析レポート生成時に対象期間が月初日00:00:00で開始される", () => {
    // Arrange
    const salesPersonId = "SP001";
    const salesPersonName = "山田太郎";
    const targetMonth = "2024-01-01";

    const transactionRecords = [
      {
        id: "TXN001",
        salesPersonId: salesPersonId,
        customerId: "C001",
        customerName: "顧客A",
        activityType: "初回接触",
        activityDate: "2024-01-05T10:30:00Z",
        proposalContent: "提案1",
        dealAmount: 100000,
        closedFlag: true,
        closedDate: "2024-01-15T15:45:00Z",
      },
      {
        id: "TXN002",
        salesPersonId: salesPersonId,
        customerId: "C002",
        customerName: "顧客B",
        activityType: "フォローアップ",
        activityDate: "2024-01-10T14:20:00Z",
        proposalContent: "提案2",
        dealAmount: 200000,
        closedFlag: false,
        closedDate: null,
      },
      {
        id: "TXN003",
        salesPersonId: salesPersonId,
        customerId: "C003",
        customerName: "顧客C",
        activityType: "交渉",
        activityDate: "2024-01-20T09:15:00Z",
        proposalContent: "提案3",
        dealAmount: 150000,
        closedFlag: true,
        closedDate: "2024-01-25T16:30:00Z",
      },
    ];

    const salesPerson = {
      id: salesPersonId,
      name: salesPersonName,
      department: "営業部",
      joinDate: "2023-01-01",
    };

    // Act
    const report = generateMonthlyAnalysisReport({
      targetMonth: targetMonth,
      salesPerson: salesPerson,
      transactionRecords: transactionRecords,
    });

    // Assert
    expect(report.analysisStartDateTime).toBe("2024-01-01T00:00:00Z");
    expect(report.analysisEndDateTime).toBe("2024-01-31T23:59:59Z");
    expect(report.targetMonth).toBe("2024-01");
  });
});