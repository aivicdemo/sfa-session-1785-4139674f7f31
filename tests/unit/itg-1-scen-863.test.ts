import { describe, test, expect, beforeEach } from "@jest/globals";
import { calculateFollowupSuccessRateByRepresentative } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-863: [normal] 月次営業品質統計分析機能 - 過去3ヶ月の営業担当者別フォローアップ成功率が正常に集計される
  test("should calculate follow-up success rate by representative for past 3 months with correct percentages", () => {
    const past_three_months_data = [
      {
        representative_id: "rep_001",
        representative_name: "担当者A",
        month: "2024-09",
        followup_attempts: 10,
        followup_successes: 5,
      },
      {
        representative_id: "rep_001",
        representative_name: "担当者A",
        month: "2024-10",
        followup_attempts: 12,
        followup_successes: 8,
      },
      {
        representative_id: "rep_001",
        representative_name: "担当者A",
        month: "2024-11",
        followup_attempts: 9,
        followup_successes: 7,
      },
      {
        representative_id: "rep_002",
        representative_name: "担当者B",
        month: "2024-09",
        followup_attempts: 8,
        followup_successes: 3,
      },
      {
        representative_id: "rep_002",
        representative_name: "担当者B",
        month: "2024-10",
        followup_attempts: 10,
        followup_successes: 6,
      },
      {
        representative_id: "rep_002",
        representative_name: "担当者B",
        month: "2024-11",
        followup_attempts: 8,
        followup_successes: 5,
      },
      {
        representative_id: "rep_003",
        representative_name: "担当者C",
        month: "2024-09",
        followup_attempts: 10,
        followup_successes: 6,
      },
      {
        representative_id: "rep_003",
        representative_name: "担当者C",
        month: "2024-10",
        followup_attempts: 11,
        followup_successes: 9,
      },
      {
        representative_id: "rep_003",
        representative_name: "担当者C",
        month: "2024-11",
        followup_attempts: 10,
        followup_successes: 8,
      },
      {
        representative_id: "rep_004",
        representative_name: "担当者D",
        month: "2024-09",
        followup_attempts: 9,
        followup_successes: 4,
      },
      {
        representative_id: "rep_004",
        representative_name: "担当者D",
        month: "2024-10",
        followup_attempts: 11,
        followup_successes: 5,
      },
      {
        representative_id: "rep_004",
        representative_name: "担当者D",
        month: "2024-11",
        followup_attempts: 10,
        followup_successes: 6,
      },
      {
        representative_id: "rep_005",
        representative_name: "担当者E",
        month: "2024-09",
        followup_attempts: 12,
        followup_successes: 7,
      },
      {
        representative_id: "rep_005",
        representative_name: "担当者E",
        month: "2024-10",
        followup_attempts: 14,
        followup_successes: 10,
      },
      {
        representative_id: "rep_005",
        representative_name: "担当者E",
        month: "2024-11",
        followup_attempts: 11,
        followup_successes: 9,
      },
    ];

    const result = calculateFollowupSuccessRateByRepresentative(past_three_months_data);

    expect(result).toEqual([
      {
        representative_id: "rep_001",
        representative_name: "担当者A",
        total_followup_attempts: 31,
        total_followup_successes: 20,
        success_rate_percentage: 64.52,
      },
      {
        representative_id: "rep_002",
        representative_name: "担当者B",
        total_followup_attempts: 26,
        total_followup_successes: 14,
        success_rate_percentage: 53.85,
      },
      {
        representative_id: "rep_003",
        representative_name: "担当者C",
        total_followup_attempts: 31,
        total_followup_successes: 23,
        success_rate_percentage: 74.19,
      },
      {
        representative_id: "rep_004",
        representative_name: "担当者D",
        total_followup_attempts: 30,
        total_followup_successes: 15,
        success_rate_percentage: 50.0,
      },
      {
        representative_id: "rep_005",
        representative_name: "担当者E",
        total_followup_attempts: 37,
        total_followup_successes: 26,
        success_rate_percentage: 70.27,
      },
    ]);
  });
});