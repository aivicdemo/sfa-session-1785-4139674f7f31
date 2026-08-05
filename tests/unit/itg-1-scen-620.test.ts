import { describe, test, expect, beforeEach } from "@jest/globals";
import { analyzeProposalAndGenerateReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-620
  test("提案内容が標準プロセス定義と異なるフィールド構造を持つときエラーになる", () => {
    const standardProcessDefinition = {
      stages: [
        {
          stageName: "初回接触",
          requiredFields: ["contactDate", "customerName"],
        },
        {
          stageName: "提案",
          requiredFields: [
            "proposalDate",
            "proposalContent",
            "estimatedAmount",
          ],
        },
        {
          stageName: "交渉",
          requiredFields: ["negotiationDate", "negotiationPoints"],
        },
        {
          stageName: "成約",
          requiredFields: ["closingDate", "finalAmount", "contractTerms"],
        },
      ],
      allowedProposalFields: [
        "proposalDate",
        "proposalContent",
        "estimatedAmount",
        "customerSegment",
        "productCategory",
      ],
    };

    const invalidProposalData = {
      proposalDate: "2024-01-15",
      proposalContent: "営業商品A提案",
      estimatedAmount: 500000,
      customerSegment: "大規模顧客",
      productCategory: "SaaS",
      営業段階: "提案",
    };

    const salesRepresentativeData = {
      repId: "SR001",
      repName: "営業太郎",
      department: "営業部",
    };

    const closingRecordList = [
      {
        closingId: "CLS001",
        repId: "SR001",
        closingDate: "2024-01-20",
        closingAmount: 500000,
        closingStatus: "成約",
      },
    ];

    expect(() =>
      analyzeProposalAndGenerateReport(
        standardProcessDefinition,
        invalidProposalData,
        salesRepresentativeData,
        closingRecordList
      )
    ).toThrow(/フィールド構造/);
  });
});