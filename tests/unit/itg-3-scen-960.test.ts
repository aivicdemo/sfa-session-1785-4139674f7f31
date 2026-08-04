import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨生成機能 - AIエージェント外部API失敗時の代替パターン返却", () => {
  test("SCEN-960: AIRecommendationEngine.generateRecommendation が 3 回連続で失敗したとき、内部推奨パターンマスタから代替パターンが返される", async () => {
    // Setup: 内部推奨パターンマスタのモックデータ
    const fallbackPatternMaster = [
      {
        pattern_id: "REC-001",
        industry: "製造業",
        budget_range_min: 10000000,
        budget_range_max: null,
        decision_maker_count_min: 3,
        recommended_content: "提案型営業アプローチ",
        success_rate: 85,
      },
      {
        pattern_id: "REC-002",
        industry: "製造業",
        budget_range_min: 10000000,
        budget_range_max: null,
        decision_maker_count_min: 3,
        recommended_content: "関係構築型営業アプローチ",
        success_rate: 78,
      },
    ];

    // Setup: AIRecommendationEngine のスタブ（3回連続でエラー）
    let attempt_count = 0;
    const stub_ai_engine = {
      generateRecommendation: async (
        industry: string,
        budget_scale: string,
        decision_maker_count: number
      ) => {
        attempt_count++;
        if (attempt_count <= 3) {
          const timeout_error = new Error("API timeout after 30 seconds");
          (timeout_error as any).code = "ECONNABORTED";
          throw timeout_error;
        }
        return {
          pattern_id: "REC-ONLINE",
          recommended_content: "online-approach",
          success_rate: 90,
          reasoning: "Online channels effective for this segment",
        };
      },
    };

    // Setup: 内部推奨パターンマスタへのアクセスをシミュレート
    const stub_pattern_repository = {
      findTopSuccessPattern: (
        industry: string,
        budget_range_min: number,
        decision_maker_count_min: number
      ) => {
        const matching = fallbackPatternMaster.filter(
          (p) =>
            p.industry === industry &&
            p.budget_range_min <= budget_range_min &&
            p.decision_maker_count_min <= decision_maker_count_min
        );
        return matching.sort((a, b) => b.success_rate - a.success_rate)[0] || null;
      },
    };

    // Input: 新規案件の顧客・商談条件
    const deal_input = {
      industry: "製造業",
      budget_scale: "1000万以上",
      budget_value_numeric: 10000000,
      decision_maker_count: 3,
    };

    // Execute: generateRecommendation() を呼び出し（AIエンジンとパターンリポジトリを注入）
    const result = await generateRecommendation(
      deal_input,
      stub_ai_engine,
      stub_pattern_repository,
      {
        max_retries: 3,
        initial_backoff_ms: 1000,
        backoff_multiplier: 2,
        timeout_ms: 30000,
      }
    );

    // Verify: 3回の再試行が実行されたこと
    expect(attempt_count).toBe(3);

    // Verify: 代替パターンが返却されること
    expect(result).toBeDefined();
    expect(result.pattern_id).toBe("REC-001");
    expect(result.recommended_content).toBe("提案型営業アプローチ");
    expect(result.success_rate).toBe(85);

    // Verify: 根拠説明が簡略版で構成されていること
    expect(result.reasoning_brief).toBeDefined();
    expect(result.reasoning_brief).toMatch(
      /過去の成功事例から上位パターンを推奨/
    );
    expect(result.reasoning_brief.length).toBeLessThan(200); // 簡略版の文字数上限

    // Verify: フラグで代替パターンであることが明示されていること
    expect(result.is_fallback).toBe(true);
    expect(result.fallback_reason).toMatch(/APIエラー/);
  });
});