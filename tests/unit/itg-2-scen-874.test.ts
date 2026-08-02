import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-874
  test("正規化対象データに重複レコードが含まれるとき、重複を含めて全件正規化される", () => {
    const input_records = [
      {
        customer_id: "C001",
        name: "山田 太郎",
        email: "YAMADA.TARO@EXAMPLE.COM",
        phone: "090-1234-5678",
      },
      {
        customer_id: "C001",
        name: "山田太郎",
        email: "yamada.taro@example.com",
        phone: "0901234-5678",
      },
      {
        customer_id: "C002",
        name: "鈴木 花子",
        email: "SUZUKI.HANAKO@EXAMPLE.COM",
        phone: "090-9876-5432",
      },
      {
        customer_id: "C003",
        name: "佐藤 次郎",
        email: "sato.jiro@EXAMPLE.COM",
        phone: "09012345678",
      },
      {
        customer_id: "C004",
        name: "高橋 美咲",
        email: "TAKAHASHI.MISAKI@EXAMPLE.COM",
        phone: "090-5555-5555",
      },
      {
        customer_id: "C005",
        name: "田中 健太",
        email: "tanaka.kenta@example.com",
        phone: "090-2222-3333",
      },
      {
        customer_id: "C006",
        name: "伊藤 由美",
        email: "ITO.YUMI@EXAMPLE.COM",
        phone: "090-4444-4444",
      },
      {
        customer_id: "C007",
        name: "渡辺 拓也",
        email: "watanabe.takuya@EXAMPLE.COM",
        phone: "090-1111-1111",
      },
      {
        customer_id: "C008",
        name: "中村 由紀",
        email: "nakamura.yuki@example.com",
        phone: "090-6666-6666",
      },
      {
        customer_id: "C009",
        name: "山本 紗季",
        email: "YAMAMOTO.SAKI@EXAMPLE.COM",
        phone: "090-7777-7777",
      },
    ];

    const result = normalizeCustomerData(input_records);

    expect(result.output_records.length).toBe(10);

    const c001_records = result.output_records.filter(
      (r) => r.customer_id === "C001"
    );
    expect(c001_records.length).toBe(2);

    c001_records.forEach((record) => {
      expect(record.name).toBe("山田太郎");
      expect(record.email).toBe("yamada.taro@example.com");
      expect(record.phone).toBe("09012345678");
    });

    const c002 = result.output_records.find((r) => r.customer_id === "C002");
    expect(c002?.name).toBe("鈴木花子");
    expect(c002?.email).toBe("suzuki.hanako@example.com");
    expect(c002?.phone).toBe("09098765432");

    const c003 = result.output_records.find((r) => r.customer_id === "C003");
    expect(c003?.name).toBe("佐藤次郎");
    expect(c003?.email).toBe("sato.jiro@example.com");
    expect(c003?.phone).toBe("09012345678");

    const c004 = result.output_records.find((r) => r.customer_id === "C004");
    expect(c004?.name).toBe("高橋美咲");
    expect(c004?.email).toBe("takahashi.misaki@example.com");
    expect(c004?.phone).toBe("09055555555");

    const c005 = result.output_records.find((r) => r.customer_id === "C005");
    expect(c005?.name).toBe("田中健太");
    expect(c005?.email).toBe("tanaka.kenta@example.com");
    expect(c005?.phone).toBe("09022223333");

    const c006 = result.output_records.find((r) => r.customer_id === "C006");
    expect(c006?.name).toBe("伊藤由美");
    expect(c006?.email).toBe("ito.yumi@example.com");
    expect(c006?.phone).toBe("09044444444");

    const c007 = result.output_records.find((r) => r.customer_id === "C007");
    expect(c007?.name).toBe("渡辺拓也");
    expect(c007?.email).toBe("watanabe.takuya@example.com");
    expect(c007?.phone).toBe("09011111111");

    const c008 = result.output_records.find((r) => r.customer_id === "C008");
    expect(c008?.name).toBe("中村由紀");
    expect(c008?.email).toBe("nakamura.yuki@example.com");
    expect(c008?.phone).toBe("09066666666");

    const c009 = result.output_records.find((r) => r.customer_id === "C009");
    expect(c009?.name).toBe("山本紗季");
    expect(c009?.email).toBe("yamamoto.saki@example.com");
    expect(c009?.phone).toBe("09077777777");
  });
});