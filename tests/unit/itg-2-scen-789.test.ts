import { analyzeExecutionByAgent } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析エンジン", () => {
  test("SCEN-789: 複数営業担当者の記録が混在している場合、担当者ごとに正しく分離集計される", () => {
    // Input: 営業担当者A、B、Cの3名、各5件ずつ計15件のレコード
    const executionRecords = [
      // Agent A (agentId: "AGENT_A")
      {
        agentId: "AGENT_A",
        executionDate: "2024-01-15T09:00:00Z",
        stage: "initial_contact",
        contractAmount: 50000,
      },
      {
        agentId: "AGENT_A",
        executionDate: "2024-01-15T10:30:00Z",
        stage: "proposal",
        contractAmount: 150000,
      },
      {
        agentId: "AGENT_A",
        executionDate: "2024-01-15T14:00:00Z",
        stage: "negotiation",
        contractAmount: 200000,
      },
      {
        agentId: "AGENT_A",
        executionDate: "2024-01-16T11:00:00Z",
        stage: "contract",
        contractAmount: 300000,
      },
      {
        agentId: "AGENT_A",
        executionDate: "2024-01-17T13:00:00Z",
        stage: "contract",
        contractAmount: 250000,
      },
      // Agent B (agentId: "AGENT_B")
      {
        agentId: "AGENT_B",
        executionDate: "2024-01-15T08:00:00Z",
        stage: "initial_contact",
        contractAmount: 75000,
      },
      {
        agentId: "AGENT_B",
        executionDate: "2024-01-15T11:00:00Z",
        stage: "proposal",
        contractAmount: 120000,
      },
      {
        agentId: "AGENT_B",
        executionDate: "2024-01-16T09:00:00Z",
        stage: "negotiation",
        contractAmount: 180000,
      },
      {
        agentId: "AGENT_B",
        executionDate: "2024-01-17T10:00:00Z",
        stage: "contract",
        contractAmount: 280000,
      },
      {
        agentId: "AGENT_B",
        executionDate: "2024-01-18T15:00:00Z",
        stage: "contract",
        contractAmount: 320000,
      },
      // Agent C (agentId: "AGENT_C")
      {
        agentId: "AGENT_C",
        executionDate: "2024-01-15T07:00:00Z",
        stage: "initial_contact",
        contractAmount: 60000,
      },
      {
        agentId: "AGENT_C",
        executionDate: "2024-01-15T12:00:00Z",
        stage: "proposal",
        contractAmount: 140000,
      },
      {
        agentId: "AGENT_C",
        executionDate: "2024-01-16T13:00:00Z",
        stage: "negotiation",
        contractAmount: 210000,
      },
      {
        agentId: "AGENT_C",
        executionDate: "2024-01-17T14:00:00Z",
        stage: "contract",
        contractAmount: 290000,
      },
      {
        agentId: "AGENT_C",
        executionDate: "2024-01-18T16:00:00Z",
        stage: "contract",
        contractAmount: 270000,
      },
    ];

    // Call the analysis function
    const result = analyzeExecutionByAgent(executionRecords);

    // Expected aggregation for Agent A:
    // Total records: 5
    // Total contract amount: 50000 + 150000 + 200000 + 300000 + 250000 = 950000
    // Stage breakdown: initial_contact=1, proposal=1, negotiation=1, contract=2
    const agentA = result.find((r) => r.agentId === "AGENT_A");
    expect(agentA).toBeDefined();
    expect(agentA.totalRecords).toBe(5);
    expect(agentA.totalContractAmount).toBe(950000);
    expect(agentA.stageBreakdown.initial_contact).toBe(1);
    expect(agentA.stageBreakdown.proposal).toBe(1);
    expect(agentA.stageBreakdown.negotiation).toBe(1);
    expect(agentA.stageBreakdown.contract).toBe(2);

    // Expected aggregation for Agent B:
    // Total records: 5
    // Total contract amount: 75000 + 120000 + 180000 + 280000 + 320000 = 955000
    // Stage breakdown: initial_contact=1, proposal=1, negotiation=1, contract=2
    const agentB = result.find((r) => r.agentId === "AGENT_B");
    expect(agentB).toBeDefined();
    expect(agentB.totalRecords).toBe(5);
    expect(agentB.totalContractAmount).toBe(955000);
    expect(agentB.stageBreakdown.initial_contact).toBe(1);
    expect(agentB.stageBreakdown.proposal).toBe(1);
    expect(agentB.stageBreakdown.negotiation).toBe(1);
    expect(agentB.stageBreakdown.contract).toBe(2);

    // Expected aggregation for Agent C:
    // Total records: 5
    // Total contract amount: 60000 + 140000 + 210000 + 290000 + 270000 = 970000
    // Stage breakdown: initial_contact=1, proposal=1, negotiation=1, contract=2
    const agentC = result.find((r) => r.agentId === "AGENT_C");
    expect(agentC).toBeDefined();
    expect(agentC.totalRecords).toBe(5);
    expect(agentC.totalContractAmount).toBe(970000);
    expect(agentC.stageBreakdown.initial_contact).toBe(1);
    expect(agentC.stageBreakdown.proposal).toBe(1);
    expect(agentC.stageBreakdown.negotiation).toBe(1);
    expect(agentC.stageBreakdown.contract).toBe(2);

    // Verify no duplication and total count
    expect(result).toHaveLength(3);
    const totalRecordsAcrossAgents =
      agentA.totalRecords + agentB.totalRecords + agentC.totalRecords;
    expect(totalRecordsAcrossAgents).toBe(15);
  });
});