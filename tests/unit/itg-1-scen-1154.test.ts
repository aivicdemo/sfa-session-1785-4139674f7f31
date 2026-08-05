import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  generateSalesPersonBehaviorAnalysisReport,
  SalesPersonBehaviorAnalysisInput,
  SalesPersonBehaviorAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1154: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 分析対象期間が月をまたぐとき正確に集計される
  it("分析対象期間が月をまたぐとき、月ごとに正確に集計され、重複なく合計が成立する", () => {
    // 準備: テスト対象の営業担当者を1名選定
    const sales_person_id = "SP001";
    const sales_person_name = "山田太郎";

    // 分析対象期間を「2024年1月15日～2024年2月10日」に設定
    const period_start_date = new Date("2024-01-15T00:00:00Z");
    const period_end_date = new Date("2024-02-10T23:59:59Z");

    // この期間における営業担当者の行動データをスタブから取得
    // 1月15日～1月31日のデータ
    const january_behaviors = [
      {
        behavior_id: "BH001",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-01-15T09:00:00Z"),
        behavior_type: "visit",
        customer_id: "CUST001",
        duration_minutes: 45,
      },
      {
        behavior_id: "BH002",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-01-18T10:30:00Z"),
        behavior_type: "proposal",
        customer_id: "CUST001",
        duration_minutes: 30,
      },
      {
        behavior_id: "BH003",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-01-22T14:00:00Z"),
        behavior_type: "visit",
        customer_id: "CUST002",
        duration_minutes: 50,
      },
      {
        behavior_id: "BH004",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-01-25T11:00:00Z"),
        behavior_type: "follow_up",
        customer_id: "CUST001",
        duration_minutes: 20,
      },
      {
        behavior_id: "BH005",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-01-31T16:00:00Z"),
        behavior_type: "contract",
        customer_id: "CUST002",
        duration_minutes: 60,
      },
    ];

    // 2月1日～2月10日のデータ
    const february_behaviors = [
      {
        behavior_id: "BH006",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-02-01T09:00:00Z"),
        behavior_type: "visit",
        customer_id: "CUST003",
        duration_minutes: 55,
      },
      {
        behavior_id: "BH007",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-02-05T10:00:00Z"),
        behavior_type: "proposal",
        customer_id: "CUST003",
        duration_minutes: 40,
      },
      {
        behavior_id: "BH008",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-02-08T13:30:00Z"),
        behavior_type: "visit",
        customer_id: "CUST004",
        duration_minutes: 35,
      },
      {
        behavior_id: "BH009",
        sales_person_id: sales_person_id,
        behavior_date: new Date("2024-02-10T15:00:00Z"),
        behavior_type: "contract",
        customer_id: "CUST003",
        duration_minutes: 65,
      },
    ];

    const all_behaviors = [...january_behaviors, ...february_behaviors];

    // 月別の期待集計値を事前計算
    const january_visit_count = 2; // BH001, BH003
    const january_proposal_count = 1; // BH002
    const january_follow_up_count = 1; // BH004
    const january_contract_count = 1; // BH005
    const january_total_count = 5;
    const january_total_duration_minutes = 45 + 30 + 50 + 20 + 60; // 205

    const february_visit_count = 2; // BH006, BH008
    const february_proposal_count = 1; // BH007
    const february_contract_count = 1; // BH009
    const february_total_count = 4;
    const february_total_duration_minutes = 55 + 40 + 35 + 65; // 195

    const total_count = january_total_count + february_total_count; // 9
    const total_duration_minutes = january_total_duration_minutes + february_total_duration_minutes; // 400
    const average_duration_minutes = total_duration_minutes / total_count; // 400 / 9 = 44.444...

    // 行動パターン分析レポート生成関数の入力を準備
    const input: SalesPersonBehaviorAnalysisInput = {
      sales_person_id: sales_person_id,
      sales_person_name: sales_person_name,
      period_start_date: period_start_date,
      period_end_date: period_end_date,
      behaviors: all_behaviors,
    };

    // 行動パターン分析レポート生成機能を実行
    const report: SalesPersonBehaviorAnalysisReport = generateSalesPersonBehaviorAnalysisReport(input);

    // 生成されたレポートの集計値を検証
    // 検証①: 1月15日～1月31日の件数と2月1日～2月10日の件数が月ごとに正確に分離集計されている
    expect(report.monthly_breakdown).toBeDefined();
    expect(report.monthly_breakdown.length).toBe(2);

    const january_breakdown = report.monthly_breakdown.find(
      (m) => m.month === "2024-01"
    );
    expect(january_breakdown).toBeDefined();
    expect(january_breakdown!.total_behavior_count).toBe(january_total_count);
    expect(january_breakdown!.visit_count).toBe(january_visit_count);
    expect(january_breakdown!.proposal_count).toBe(january_proposal_count);
    expect(january_breakdown!.follow_up_count).toBe(january_follow_up_count);
    expect(january_breakdown!.contract_count).toBe(january_contract_count);
    expect(january_breakdown!.total_duration_minutes).toBe(
      january_total_duration_minutes
    );

    const february_breakdown = report.monthly_breakdown.find(
      (m) => m.month === "2024-02"
    );
    expect(february_breakdown).toBeDefined();
    expect(february_breakdown!.total_behavior_count).toBe(february_total_count);
    expect(february_breakdown!.visit_count).toBe(february_visit_count);
    expect(february_breakdown!.proposal_count).toBe(february_proposal_count);
    expect(february_breakdown!.contract_count).toBe(february_contract_count);
    expect(february_breakdown!.total_duration_minutes).toBe(
      february_total_duration_minutes
    );

    // 検証②: 月またがり期間全体の合計件数 = 1月分件数 + 2月分件数が成立している
    expect(report.total_behavior_count).toBe(total_count);
    expect(report.total_behavior_count).toBe(
      january_breakdown!.total_behavior_count +
        february_breakdown!.total_behavior_count
    );

    // 検証③: 日付順序による重複計上がなく、各行動データが唯一の月に割り当てられている
    const assigned_behavior_ids = new Set<string>();
    for (const monthly_data of report.monthly_breakdown) {
      for (const behavior_id of monthly_data.behavior_ids) {
        expect(assigned_behavior_ids.has(behavior_id)).toBe(false);
        assigned_behavior_ids.add(behavior_id);
      }
    }
    // すべての入力行動データがちょうど1回ずつ割り当てられている
    expect(assigned_behavior_ids.size).toBe(all_behaviors.length);
    for (const behavior of all_behaviors) {
      expect(assigned_behavior_ids.has(behavior.behavior_id)).toBe(true);
    }

    // 検証④: 平均商談時間が正確に計算されている
    expect(report.average_duration_minutes).toBeCloseTo(
      average_duration_minutes,
      1
    );

    // 検証⑤: レポートの基本情報が正確に記録されている
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.sales_person_name).toBe(sales_person_name);
    expect(report.period_start_date).toEqual(period_start_date);
    expect(report.period_end_date).toEqual(period_end_date);
  });
});