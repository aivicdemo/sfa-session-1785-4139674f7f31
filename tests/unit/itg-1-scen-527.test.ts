import {
  generateSalesActivityPatternAnalysisReport,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-527: 失敗パターンに該当する商談が複数存在する場合、全パターンが重複なく抽出される", () => {
    // 失敗パターンA: 初期接触なし
    const failurePatternA_Deal1 = {
      dealId: "DEAL-001",
      dealName: "顧客A案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-001",
      customerName: "顧客A",
      dealStatus: "失注",
      createdAt: "2024-01-01T10:00:00Z",
      firstContactDate: null,
      firstContactCompleted: false,
      proposalSubmittedDate: "2024-01-05T14:00:00Z",
      proposalSubmitted: true,
      quotationSubmittedDate: "2024-01-10T09:00:00Z",
      quotationSubmitted: true,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-20T16:30:00Z",
      failureReasonCode: "NO_INITIAL_CONTACT",
    };

    const failurePatternA_Deal2 = {
      dealId: "DEAL-002",
      dealName: "顧客B案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-002",
      customerName: "顧客B",
      dealStatus: "失注",
      createdAt: "2024-01-02T10:00:00Z",
      firstContactDate: null,
      firstContactCompleted: false,
      proposalSubmittedDate: "2024-01-06T14:00:00Z",
      proposalSubmitted: true,
      quotationSubmittedDate: "2024-01-11T09:00:00Z",
      quotationSubmitted: true,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-21T16:30:00Z",
      failureReasonCode: "NO_INITIAL_CONTACT",
    };

    const failurePatternA_Deal3 = {
      dealId: "DEAL-003",
      dealName: "顧客C案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-003",
      customerName: "顧客C",
      dealStatus: "失注",
      createdAt: "2024-01-03T10:00:00Z",
      firstContactDate: null,
      firstContactCompleted: false,
      proposalSubmittedDate: "2024-01-07T14:00:00Z",
      proposalSubmitted: true,
      quotationSubmittedDate: "2024-01-12T09:00:00Z",
      quotationSubmitted: true,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-22T16:30:00Z",
      failureReasonCode: "NO_INITIAL_CONTACT",
    };

    // 失敗パターンB: 提案資料未提出
    const failurePatternB_Deal1 = {
      dealId: "DEAL-004",
      dealName: "顧客D案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-004",
      customerName: "顧客D",
      dealStatus: "失注",
      createdAt: "2024-01-04T10:00:00Z",
      firstContactDate: "2024-01-04T11:00:00Z",
      firstContactCompleted: true,
      proposalSubmittedDate: null,
      proposalSubmitted: false,
      quotationSubmittedDate: "2024-01-13T09:00:00Z",
      quotationSubmitted: true,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-23T16:30:00Z",
      failureReasonCode: "NO_PROPOSAL_SUBMITTED",
    };

    const failurePatternB_Deal2 = {
      dealId: "DEAL-005",
      dealName: "顧客E案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-005",
      customerName: "顧客E",
      dealStatus: "失注",
      createdAt: "2024-01-05T10:00:00Z",
      firstContactDate: "2024-01-05T11:00:00Z",
      firstContactCompleted: true,
      proposalSubmittedDate: null,
      proposalSubmitted: false,
      quotationSubmittedDate: "2024-01-14T09:00:00Z",
      quotationSubmitted: true,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-24T16:30:00Z",
      failureReasonCode: "NO_PROPOSAL_SUBMITTED",
    };

    // 失敗パターンC: 見積提示なし
    const failurePatternC_Deal1 = {
      dealId: "DEAL-006",
      dealName: "顧客F案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-006",
      customerName: "顧客F",
      dealStatus: "失注",
      createdAt: "2024-01-06T10:00:00Z",
      firstContactDate: "2024-01-06T11:00:00Z",
      firstContactCompleted: true,
      proposalSubmittedDate: "2024-01-08T14:00:00Z",
      proposalSubmitted: true,
      quotationSubmittedDate: null,
      quotationSubmitted: false,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-25T16:30:00Z",
      failureReasonCode: "NO_QUOTATION_SUBMITTED",
    };

    const failurePatternC_Deal2 = {
      dealId: "DEAL-007",
      dealName: "顧客G案件1",
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      customerId: "CUST-007",
      customerName: "顧客G",
      dealStatus: "失注",
      createdAt: "2024-01-07T10:00:00Z",
      firstContactDate: "2024-01-07T11:00:00Z",
      firstContactCompleted: true,
      proposalSubmittedDate: "2024-01-09T14:00:00Z",
      proposalSubmitted: true,
      quotationSubmittedDate: null,
      quotationSubmitted: false,
      contractDate: null,
      contractCompleted: false,
      closedAt: "2024-01-26T16:30:00Z",
      failureReasonCode: "NO_QUOTATION_SUBMITTED",
    };

    const allDeals = [
      failurePatternA_Deal1,
      failurePatternA_Deal2,
      failurePatternA_Deal3,
      failurePatternB_Deal1,
      failurePatternB_Deal2,
      failurePatternC_Deal1,
      failurePatternC_Deal2,
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId: "SP-001",
      salesPersonName: "営業太郎",
      analysisPeriodStart: "2024-01-01",
      analysisPeriodEnd: "2024-01-31",
      deals: allDeals,
    });

    // 失敗パターン分類セクションの検証
    expect(report.failurePatternClassification).toBeDefined();

    // 失敗パターンA（初期接触なし）の検証
    const patternA = report.failurePatternClassification.find(
      (pattern: { patternCode: string }) =>
        pattern.patternCode === "NO_INITIAL_CONTACT"
    );
    expect(patternA).toBeDefined();
    expect(patternA.patternName).toBe("初期接触なし");
    expect(patternA.dealCount).toBe(3);
    expect(patternA.dealIds).toEqual(["DEAL-001", "DEAL-002", "DEAL-003"]);
    expect(patternA.occurrenceCount).toBe(1); // パターンの発見回数は1回

    // 失敗パターンB（提案資料未提出）の検証
    const patternB = report.failurePatternClassification.find(
      (pattern: { patternCode: string }) =>
        pattern.patternCode === "NO_PROPOSAL_SUBMITTED"
    );
    expect(patternB).toBeDefined();
    expect(patternB.patternName).toBe("提案資料未提出");
    expect(patternB.dealCount).toBe(2);
    expect(patternB.dealIds).toEqual(["DEAL-004", "DEAL-005"]);
    expect(patternB.occurrenceCount).toBe(1);

    // 失敗パターンC（見積提示なし）の検証
    const patternC = report.failurePatternClassification.find(
      (pattern: { patternCode: string }) =>
        pattern.patternCode === "NO_QUOTATION_SUBMITTED"
    );
    expect(patternC).toBeDefined();
    expect(patternC.patternName).toBe("見積提示なし");
    expect(patternC.dealCount).toBe(2);
    expect(patternC.dealIds).toEqual(["DEAL-006", "DEAL-007"]);
    expect(patternC.occurrenceCount).toBe(1);

    // 失敗パターンが正確に3つだけ存在することを検証（重複がないこと）
    expect(report.failurePatternClassification).toHaveLength(3);

    // 全商談が正確に分類されていることを検証
    const totalClassifiedDeals = report.failurePatternClassification.reduce(
      (sum: number, pattern: { dealCount: number }) => sum + pattern.dealCount,
      0
    );
    expect(totalClassifiedDeals).toBe(7);
  });
});