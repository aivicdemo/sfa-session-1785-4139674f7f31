import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  selectBehaviorAnalysisIndicators,
  SelectBehaviorAnalysisIndicatorsInput,
} from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析指標自動選定機能", () => {
  // SCEN-1076
  test("営業担当者の権限がない場合にエラーが発生する", () => {
    const input: SelectBehaviorAnalysisIndicatorsInput = {
      user_id: "user_no_permission",
      user_role: "guest",
      monthly_meeting_trigger_date: "2024-01-15",
      process_standard_book_defined: true,
      sales_performance_data_available: true,
    };

    expect(() => selectBehaviorAnalysisIndicators(input)).toThrow(
      /営業担当者権限/
    );
  });
});