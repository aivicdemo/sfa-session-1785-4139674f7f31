import { recordCustomerResponse } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-305: 顧客反応記録・標準化機能 - 記録された反応データがAIエージェントの学習データとして蓄積される", async () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const response_payload_1 = {
      responseType: "objection",
      content: "価格が高い",
      timestamp: "2024-01-15T10:30:00Z",
      customerId: "C001",
      agentId: "A001",
    };

    const response_payload_2 = {
      responseType: "interest",
      content: "さらに詳細が聞きたい",
      timestamp: "2024-01-15T11:00:00Z",
      customerId: "C002",
      agentId: "A001",
    };

    const response_payload_3 = {
      responseType: "follow_up_needed",
      content: "後日改めて連絡ください",
      timestamp: "2024-01-15T11:30:00Z",
      customerId: "C003",
      agentId: "A002",
    };

    const stored_response_1 = {
      id: "RES-001",
      responseType: "objection",
      content: "価格が高い",
      timestamp: "2024-01-15T10:30:00Z",
      customerId: "C001",
      agentId: "A001",
      createdAt: "2024-01-15T10:30:05Z",
      status: "ready_for_learning",
    };

    const stored_response_2 = {
      id: "RES-002",
      responseType: "interest",
      content: "さらに詳細が聞きたい",
      timestamp: "2024-01-15T11:00:00Z",
      customerId: "C002",
      agentId: "A001",
      createdAt: "2024-01-15T11:00:05Z",
      status: "ready_for_learning",
    };

    const stored_response_3 = {
      id: "RES-003",
      responseType: "follow_up_needed",
      content: "後日改めて連絡ください",
      timestamp: "2024-01-15T11:30:00Z",
      customerId: "C003",
      agentId: "A002",
      createdAt: "2024-01-15T11:30:05Z",
      status: "ready_for_learning",
    };

    fetchMock.mockResponseOnce(JSON.stringify(stored_response_1), {
      status: 201,
    });

    const result_1 = await recordCustomerResponse(response_payload_1);

    expect(result_1.status).toBe(201);
    expect(result_1.data.id).toBe("RES-001");
    expect(result_1.data.responseType).toBe("objection");
    expect(result_1.data.content).toBe("価格が高い");
    expect(result_1.data.timestamp).toBe("2024-01-15T10:30:00Z");
    expect(result_1.data.customerId).toBe("C001");
    expect(result_1.data.agentId).toBe("A001");
    expect(result_1.data.status).toBe("ready_for_learning");
    expect(result_1.data.createdAt).toBe("2024-01-15T10:30:05Z");

    fetchMock.mockResponseOnce(JSON.stringify(stored_response_2), {
      status: 201,
    });

    const result_2 = await recordCustomerResponse(response_payload_2);

    expect(result_2.status).toBe(201);
    expect(result_2.data.id).toBe("RES-002");
    expect(result_2.data.responseType).toBe("interest");
    expect(result_2.data.content).toBe("さらに詳細が聞きたい");
    expect(result_2.data.customerId).toBe("C002");
    expect(result_2.data.status).toBe("ready_for_learning");

    fetchMock.mockResponseOnce(JSON.stringify(stored_response_3), {
      status: 201,
    });

    const result_3 = await recordCustomerResponse(response_payload_3);

    expect(result_3.status).toBe(201);
    expect(result_3.data.id).toBe("RES-003");
    expect(result_3.data.responseType).toBe("follow_up_needed");
    expect(result_3.data.content).toBe("後日改めて連絡ください");
    expect(result_3.data.customerId).toBe("C003");
    expect(result_3.data.agentId).toBe("A002");
    expect(result_3.data.status).toBe("ready_for_learning");

    fetchMock.mockResponseOnce(
      JSON.stringify([stored_response_1, stored_response_2, stored_response_3]),
      { status: 200 }
    );

    const all_responses = await fetch("/api/ai-learning-store/responses").then(
      (res) => res.json()
    );

    expect(Array.isArray(all_responses)).toBe(true);
    expect(all_responses).toHaveLength(3);
    expect(all_responses[0].id).toBe("RES-001");
    expect(all_responses[1].id).toBe("RES-002");
    expect(all_responses[2].id).toBe("RES-003");
    expect(all_responses.every((r: any) => r.status === "ready_for_learning")).toBe(
      true
    );
  });
});