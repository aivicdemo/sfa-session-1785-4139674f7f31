import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-747: [normal] 行動パターン分析対象指標の自動選定機能 - 成約実績が複数件の場合、相関分析により重要な指標が優先度付けされて選定される
  test("成約実績が複数件の場合、相関係数が高い順に指標が優先度付けされる", () => {
    const contractResults = [
      {
        id: "contract_001",
        salesPersonId: "sales_001",
        customerId: "customer_001",
        contractAmount: 1500000,
        contractDate: new Date("2024-01-15T09:00:00Z"),
        proposalDocumentCreationDays: 3,
        initialContactToContractDays: 25,
        followUpCount: 5,
        customerIndustry: "IT",
      },
      {
        id: "contract_002",
        salesPersonId: "sales_001",
        customerId: "customer_002",
        contractAmount: 2000000,
        contractDate: new Date("2024-02-20T10:00:00Z"),
        proposalDocumentCreationDays: 2,
        initialContactToContractDays: 20,
        followUpCount: 4,
        customerIndustry: "Finance",
      },
      {
        id: "contract_003",
        salesPersonId: "sales_001",
        customerId: "customer_003",
        contractAmount: 1200000,
        contractDate: new Date("2024-03-10T14:00:00Z"),
        proposalDocumentCreationDays: 4,
        initialContactToContractDays: 30,
        followUpCount: 6,
        customerIndustry: "Manufacturing",
      },
    ];

    const correlationMatrix = {
      proposalDocumentCreationDays: 0.85,
      initialContactToContractDays: 0.72,
      followUpCount: 0.61,
      customerIndustry: 0.45,
    };

    const result = selectAnalysisIndicators(contractResults, correlationMatrix);

    expect(result).toBeDefined();
    expect(result.length).toBe(4);
    expect(result[0]).toEqual({
      indicatorName: "proposalDocumentCreationDays",
      correlationCoefficient: 0.85,
      priority: 1,
    });
    expect(result[1]).toEqual({
      indicatorName: "initialContactToContractDays",
      correlationCoefficient: 0.72,
      priority: 2,
    });
    expect(result[2]).toEqual({
      indicatorName: "followUpCount",
      correlationCoefficient: 0.61,
      priority: 3,
    });
    expect(result[3]).toEqual({
      indicatorName: "customerIndustry",
      correlationCoefficient: 0.45,
      priority: 4,
    });

    expect(result[0].correlationCoefficient).toBeGreaterThan(
      result[1].correlationCoefficient
    );
    expect(result[1].correlationCoefficient).toBeGreaterThan(
      result[2].correlationCoefficient
    );
    expect(result[2].correlationCoefficient).toBeGreaterThan(
      result[3].correlationCoefficient
    );
  });
});