import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-864
  test("重複候補データに重複レコードが含まれるとき、重複を除外して検出が実行される", () => {
    const inputRecords = [
      {
        customerId: 1001,
        customerName: "山田太郎",
        customerEmail: "yamada@example.com",
      },
      {
        customerId: 1002,
        customerName: "山田太郎",
        customerEmail: "yamada@example.com",
      },
      {
        customerId: 1001,
        customerName: "山田太郎",
        customerEmail: "yamada@example.com",
      },
    ];

    const detectionResult = detectDuplicateCustomers(inputRecords);

    expect(detectionResult).toEqual({
      duplicatePairs: [
        {
          recordA: {
            customerId: 1001,
            customerName: "山田太郎",
            customerEmail: "yamada@example.com",
          },
          recordB: {
            customerId: 1002,
            customerName: "山田太郎",
            customerEmail: "yamada@example.com",
          },
        },
      ],
      excludedRecordsCount: 1,
    });
  });
});