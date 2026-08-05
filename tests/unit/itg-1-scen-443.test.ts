import {
  recordCustomerReactionClassification,
  queryCustomerReactionsByCustomerId,
} from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応の標準化分類記録機能", () => {
  // SCEN-443
  test("複数の顧客反応が同じ分類パターンで重複して記録されるとき重複が保持される", () => {
    const customerId = "C001";
    const classificationPattern = "問い合わせ_初期接触";
    const baseTimestamp = new Date("2024-01-15T09:00:00Z");

    // 1件目の顧客反応を記録
    const reaction1 = recordCustomerReactionClassification({
      customerId,
      classificationPattern,
      recordedAt: baseTimestamp,
    });

    // 2件目の顧客反応を記録（同じ分類パターン）
    const reaction2 = recordCustomerReactionClassification({
      customerId,
      classificationPattern,
      recordedAt: new Date("2024-01-15T10:00:00Z"),
    });

    // 3件目の顧客反応を記録（同じ分類パターン）
    const reaction3 = recordCustomerReactionClassification({
      customerId,
      classificationPattern,
      recordedAt: new Date("2024-01-15T11:00:00Z"),
    });

    // 記録された顧客反応一覧をクエリ
    const recordedReactions = queryCustomerReactionsByCustomerId({
      customerId,
    });

    // 期待結果: 3件すべてが保持されている
    expect(recordedReactions).toHaveLength(3);

    // 各レコードが異なるID または タイムスタンプを持つ
    expect(recordedReactions[0].id).not.toBe(recordedReactions[1].id);
    expect(recordedReactions[1].id).not.toBe(recordedReactions[2].id);

    // すべてのレコードが同じ分類パターンを持つ
    expect(recordedReactions[0].classificationPattern).toBe(
      classificationPattern
    );
    expect(recordedReactions[1].classificationPattern).toBe(
      classificationPattern
    );
    expect(recordedReactions[2].classificationPattern).toBe(
      classificationPattern
    );

    // すべてのレコードが同じ顧客IDを持つ
    expect(recordedReactions[0].customerId).toBe(customerId);
    expect(recordedReactions[1].customerId).toBe(customerId);
    expect(recordedReactions[2].customerId).toBe(customerId);

    // 重複排除処理が行われていないことを確認
    expect(recordedReactions).toEqual([
      {
        id: reaction1.id,
        customerId,
        classificationPattern,
        recordedAt: baseTimestamp,
      },
      {
        id: reaction2.id,
        customerId,
        classificationPattern,
        recordedAt: new Date("2024-01-15T10:00:00Z"),
      },
      {
        id: reaction3.id,
        customerId,
        classificationPattern,
        recordedAt: new Date("2024-01-15T11:00:00Z"),
      },
    ]);
  });
});