import { approveModificationRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-586: [normal] 修正ルール承認判定機能 - 修正ルール案に対する承認または差し戻しの決定理由が適切に記録される
  test("修正ルール案の承認判定を実行し、決定内容と決定理由がデータベースに正確に記録される", () => {
    const ruleId = "RULE-2024-001";
    const approverId = "USER-00123";
    const decisionType = "approve";
    const decisionReason =
      "過去事例CASE-123と同一パターンのため承認。半角・全角統一ルールの効果実績あり";
    const decisionDatetime = new Date("2024-01-15T14:30:00Z");

    const result = approveModificationRule({
      ruleId,
      approverId,
      decisionType,
      decisionReason,
      decisionDatetime,
    });

    expect(result.status).toBe("recorded");
    expect(result.ruleId).toBe("RULE-2024-001");
    expect(result.approverId).toBe("USER-00123");
    expect(result.decisionType).toBe("approve");
    expect(result.decisionReason).toBe(
      "過去事例CASE-123と同一パターンのため承認。半角・全角統一ルールの効果実績あり"
    );
    expect(result.decisionDatetime).toEqual(new Date("2024-01-15T14:30:00Z"));
    expect(result.recordedAt).toBeDefined();
    expect(typeof result.recordedAt).toBe("string");
  });

  test("修正ルール案の差し戻し判定を実行し、決定理由が正確に記録される", () => {
    const ruleId = "RULE-2024-002";
    const approverId = "USER-00456";
    const decisionType = "reject";
    const decisionReason =
      "新規ビジネス要件への対応が不十分。営業部門との要件調整が必要";
    const decisionDatetime = new Date("2024-01-16T09:15:00Z");

    const result = approveModificationRule({
      ruleId,
      approverId,
      decisionType,
      decisionReason,
      decisionDatetime,
    });

    expect(result.status).toBe("recorded");
    expect(result.ruleId).toBe("RULE-2024-002");
    expect(result.approverId).toBe("USER-00456");
    expect(result.decisionType).toBe("reject");
    expect(result.decisionReason).toBe(
      "新規ビジネス要件への対応が不十分。営業部門との要件調整が必要"
    );
    expect(result.decisionDatetime).toEqual(new Date("2024-01-16T09:15:00Z"));
  });

  test("決定理由が空白の場合、エラーが発生して記録されない", () => {
    const ruleId = "RULE-2024-003";
    const approverId = "USER-00789";
    const decisionType = "approve";
    const decisionReason = "";
    const decisionDatetime = new Date("2024-01-17T10:00:00Z");

    expect(() =>
      approveModificationRule({
        ruleId,
        approverId,
        decisionType,
        decisionReason,
        decisionDatetime,
      })
    ).toThrow(/決定理由/);
  });

  test("決定理由が未定義の場合、エラーが発生して記録されない", () => {
    const ruleId = "RULE-2024-004";
    const approverId = "USER-01011";
    const decisionType = "approve";
    const decisionReason = undefined as any;
    const decisionDatetime = new Date("2024-01-18T11:00:00Z");

    expect(() =>
      approveModificationRule({
        ruleId,
        approverId,
        decisionType,
        decisionReason,
        decisionDatetime,
      })
    ).toThrow(/決定理由/);
  });

  test("決定者IDが存在しない場合、エラーが発生して記録されない", () => {
    const ruleId = "RULE-2024-005";
    const approverId = "";
    const decisionType = "approve";
    const decisionReason = "承認対象のルール案は妥当";
    const decisionDatetime = new Date("2024-01-19T12:00:00Z");

    expect(() =>
      approveModificationRule({
        ruleId,
        approverId,
        decisionType,
        decisionReason,
        decisionDatetime,
      })
    ).toThrow(/決定者/);
  });

  test("ルールIDが存在しない場合、エラーが発生して記録されない", () => {
    const ruleId = "";
    const approverId = "USER-01213";
    const decisionType = "approve";
    const decisionReason = "承認対象のルール案は妥当";
    const decisionDatetime = new Date("2024-01-20T13:00:00Z");

    expect(() =>
      approveModificationRule({
        ruleId,
        approverId,
        decisionType,
        decisionReason,
        decisionDatetime,
      })
    ).toThrow(/ルールID/);
  });

  test("不正な決定タイプの場合、エラーが発生して記録されない", () => {
    const ruleId = "RULE-2024-006";
    const approverId = "USER-01415";
    const decisionType = "invalid_type";
    const decisionReason = "判定理由";
    const decisionDatetime = new Date("2024-01-21T14:00:00Z");

    expect(() =>
      approveModificationRule({
        ruleId,
        approverId,
        decisionType,
        decisionReason,
        decisionDatetime,
      })
    ).toThrow(/決定タイプ/);
  });
});