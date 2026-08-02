import { describe, test, expect, beforeEach } from "@jest/globals";
import { judgeCustomerMergeTargets } from "../../src/logic/it-1-br-2-2-1-1";

describe("Customer Data Duplicate Detection and Merge Judgment", () => {
  // SCEN-500
  test("should judge all duplicate candidates as merge targets when multiple duplicates are detected", () => {
    const input_customer_records = [
      {
        customer_id: "C001",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada.taro@example.com",
        registration_date: "2024-01-01T00:00:00Z",
      },
      {
        customer_id: "C002",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada.taro.2@example.com",
        registration_date: "2024-01-02T00:00:00Z",
      },
      {
        customer_id: "C003",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada.taro.3@example.com",
        registration_date: "2024-01-03T00:00:00Z",
      },
    ];

    const result = judgeCustomerMergeTargets(input_customer_records);

    expect(result.merge_group_id).toBeDefined();
    expect(typeof result.merge_group_id).toBe("string");
    expect(result.merge_group_id.length).toBeGreaterThan(0);

    expect(result.merge_targets).toHaveLength(3);

    const all_merge_targets = result.merge_targets.every(
      (record) => record.is_merge_target === true
    );
    expect(all_merge_targets).toBe(true);

    const all_same_group = result.merge_targets.every(
      (record) => record.merge_group_id === result.merge_group_id
    );
    expect(all_same_group).toBe(true);

    const merge_flag_enabled = result.merge_targets.every(
      (record) => record.merge_flag === true
    );
    expect(merge_flag_enabled).toBe(true);

    const non_merge_targets = result.merge_targets.filter(
      (record) => record.is_merge_target === false
    );
    expect(non_merge_targets).toHaveLength(0);

    expect(result.merge_targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id: "C001",
          is_merge_target: true,
          merge_flag: true,
          merge_group_id: result.merge_group_id,
        }),
        expect.objectContaining({
          customer_id: "C002",
          is_merge_target: true,
          merge_flag: true,
          merge_group_id: result.merge_group_id,
        }),
        expect.objectContaining({
          customer_id: "C003",
          is_merge_target: true,
          merge_flag: true,
          merge_group_id: result.merge_group_id,
        }),
      ])
    );
  });
});