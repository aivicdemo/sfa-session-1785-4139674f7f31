import {
  recordCustomerReaction,
  getCustomerReactionsByMonth,
} from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応の標準化分類記録機能", () => {
  test("SCEN-445: 顧客反応の記録タイムスタンプが月初日をまたぐとき正しく分類される", () => {
    // 初期化：記録済み反応をクリア
    const reactions_before_clear = [];

    // システムの日時をUTC 2024年3月31日 23時59分59秒に設定
    const date_march_end = new Date("2024-03-31T23:59:59Z");

    // 顧客ID「CUST-12345」、反応内容「問い合わせ受信」の顧客反応を記録
    const reaction_march = recordCustomerReaction({
      customer_id: "CUST-12345",
      reaction_content: "問い合わせ受信",
      recorded_at: date_march_end,
    });

    // システムの日時をUTC 2024年4月1日 00時00分01秒に進める
    const date_april_start = new Date("2024-04-01T00:00:01Z");

    // 顧客ID「CUST-67890」、反応内容「提案承認」の顧客反応を記録
    const reaction_april = recordCustomerReaction({
      customer_id: "CUST-67890",
      reaction_content: "提案承認",
      recorded_at: date_april_start,
    });

    // 3月の顧客反応集計を取得
    const reactions_march_data = getCustomerReactionsByMonth({
      year: 2024,
      month: 3,
    });

    // 4月の顧客反応集計を取得
    const reactions_april_data = getCustomerReactionsByMonth({
      year: 2024,
      month: 4,
    });

    // 3月31日23時59分59秒に記録された「問い合わせ受信」は分類カテゴリ「inquiry」、月別集計は「2024年3月: 1件」に分類される
    expect(reaction_march.classification_category).toBe("inquiry");
    expect(reactions_march_data.total_count).toBe(1);
    expect(reactions_march_data.year).toBe(2024);
    expect(reactions_march_data.month).toBe(3);

    // 4月1日00時00分01秒に記録された「提案承認」は分類カテゴリ「approval」、月別集計は「2024年4月: 1件」に分類される
    expect(reaction_april.classification_category).toBe("approval");
    expect(reactions_april_data.total_count).toBe(1);
    expect(reactions_april_data.year).toBe(2024);
    expect(reactions_april_data.month).toBe(4);
  });
});