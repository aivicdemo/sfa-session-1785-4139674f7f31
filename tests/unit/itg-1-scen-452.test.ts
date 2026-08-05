import { aggregateSalesRepActionPatterns } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析結果レコード", () => {
  // SCEN-452: [edge] 複数営業担当者の同一顧客への反応が同一タイムスタンプで重複記録されるとき分離して集計される
  test("should aggregate multiple sales reps action patterns for same customer with same timestamp separately", () => {
    const salesRepAPattern = {
      sales_rep_id: "SR-A",
      customer_id: "CUS-001",
      action_timestamp: "2024-01-15T10:30:00Z",
      action_type: "phone_call",
      contact_count: 1,
      response_rate: 100,
    };

    const salesRepBPattern = {
      sales_rep_id: "SR-B",
      customer_id: "CUS-001",
      action_timestamp: "2024-01-15T10:30:00Z",
      action_type: "email",
      contact_count: 1,
      response_rate: 50,
    };

    const salesRepCPattern = {
      sales_rep_id: "SR-C",
      customer_id: "CUS-001",
      action_timestamp: "2024-01-15T10:30:00Z",
      action_type: "visit",
      contact_count: 1,
      response_rate: 100,
    };

    const input_patterns = [
      salesRepAPattern,
      salesRepBPattern,
      salesRepCPattern,
    ];

    const aggregated_result = aggregateSalesRepActionPatterns(input_patterns);

    expect(aggregated_result).toEqual({
      "CUS-001": {
        "2024-01-15T10:30:00Z": [
          {
            sales_rep_id: "SR-A",
            customer_id: "CUS-001",
            action_timestamp: "2024-01-15T10:30:00Z",
            action_type: "phone_call",
            contact_count: 1,
            response_rate: 100,
          },
          {
            sales_rep_id: "SR-B",
            customer_id: "CUS-001",
            action_timestamp: "2024-01-15T10:30:00Z",
            action_type: "email",
            contact_count: 1,
            response_rate: 50,
          },
          {
            sales_rep_id: "SR-C",
            customer_id: "CUS-001",
            action_timestamp: "2024-01-15T10:30:00Z",
            action_type: "visit",
            contact_count: 1,
            response_rate: 100,
          },
        ],
      },
    });

    const customer_actions_at_timestamp =
      aggregated_result["CUS-001"]["2024-01-15T10:30:00Z"];
    expect(customer_actions_at_timestamp).toHaveLength(3);
    expect(customer_actions_at_timestamp[0].sales_rep_id).toBe("SR-A");
    expect(customer_actions_at_timestamp[0].action_type).toBe("phone_call");
    expect(customer_actions_at_timestamp[1].sales_rep_id).toBe("SR-B");
    expect(customer_actions_at_timestamp[1].action_type).toBe("email");
    expect(customer_actions_at_timestamp[2].sales_rep_id).toBe("SR-C");
    expect(customer_actions_at_timestamp[2].action_type).toBe("visit");
  });
});