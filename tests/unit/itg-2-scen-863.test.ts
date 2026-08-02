import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-863
  test("同じ入力条件で重複検出を2回実行したとき、同じ結果が返される", () => {
    const test_customer_dataset = [
      {
        customer_id: "C001",
        customer_name: "山田太郎",
        postal_code: "100-0001",
        prefecture: "東京都",
        city: "千代田区",
      },
      {
        customer_id: "C002",
        customer_name: "山田太郎",
        postal_code: "100-0001",
        prefecture: "東京都",
        city: "千代田区",
      },
      {
        customer_id: "C003",
        customer_name: "鈴木花子",
        postal_code: "150-0001",
        prefecture: "東京都",
        city: "渋谷区",
      },
      {
        customer_id: "C004",
        customer_name: "佐藤次郎",
        postal_code: "200-0001",
        prefecture: "神奈川県",
        city: "横浜市",
      },
      {
        customer_id: "C005",
        customer_name: "伊藤美咲",
        postal_code: "300-0001",
        prefecture: "茨城県",
        city: "水戸市",
      },
      {
        customer_id: "C006",
        customer_name: "伊藤美咲",
        postal_code: "300-0001",
        prefecture: "茨城県",
        city: "水戸市",
      },
      {
        customer_id: "C007",
        customer_name: "木村健一",
        postal_code: "400-0001",
        prefecture: "愛知県",
        city: "名古屋市",
      },
      {
        customer_id: "C008",
        customer_name: "田中恵子",
        postal_code: "500-0001",
        prefecture: "大阪府",
        city: "大阪市",
      },
      {
        customer_id: "C009",
        customer_name: "中村優子",
        postal_code: "600-0001",
        prefecture: "京都府",
        city: "京都市",
      },
      {
        customer_id: "C010",
        customer_name: "高橋勇気",
        postal_code: "700-0001",
        prefecture: "岡山県",
        city: "岡山市",
      },
    ];

    const result_set_1 = detectDuplicateCustomers(test_customer_dataset);
    const result_set_2 = detectDuplicateCustomers(test_customer_dataset);

    expect(result_set_1.duplicate_pairs.length).toBe(
      result_set_2.duplicate_pairs.length
    );
    expect(result_set_1.duplicate_pairs.length).toBe(2);

    const sorted_pairs_1 = result_set_1.duplicate_pairs.sort(
      (a, b) =>
        a.customer_id_1.localeCompare(b.customer_id_1) ||
        a.customer_id_2.localeCompare(b.customer_id_2)
    );
    const sorted_pairs_2 = result_set_2.duplicate_pairs.sort(
      (a, b) =>
        a.customer_id_1.localeCompare(b.customer_id_1) ||
        a.customer_id_2.localeCompare(b.customer_id_2)
    );

    for (let i = 0; i < sorted_pairs_1.length; i++) {
      expect(sorted_pairs_1[i].customer_id_1).toBe(sorted_pairs_2[i].customer_id_1);
      expect(sorted_pairs_1[i].customer_id_2).toBe(sorted_pairs_2[i].customer_id_2);
    }

    for (let i = 0; i < sorted_pairs_1.length; i++) {
      const score_1 = Math.round(sorted_pairs_1[i].match_score * 10000) / 10000;
      const score_2 = Math.round(sorted_pairs_2[i].match_score * 10000) / 10000;
      expect(score_1).toBe(score_2);
    }
  });
});