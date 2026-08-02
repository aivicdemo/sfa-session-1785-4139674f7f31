import { validateSalesData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-410: 顧客情報リストが逆順で入力された場合、検証対象順序に関わらず同じ問題が検出される", () => {
    // 昇順（A→Z）の顧客情報リストを準備
    const ascendingCustomers = [
      {
        customerId: "C001",
        name: "Alice Company",
        email: "alice@example.com",
        phone: "090-1111-1111",
      },
      {
        customerId: "C002",
        name: "Bob Industries",
        email: "bob@example.com",
        phone: "090-2222-2222",
      },
      {
        customerId: "C003",
        name: "Charlie Solutions",
        email: "charlie@example.com",
        phone: "090-3333-3333",
      },
      {
        customerId: "C004",
        name: "David Tech",
        email: "david@example.com",
        phone: "090-4444-4444",
      },
      {
        customerId: "C005",
        name: "Eve Manufacturing",
        email: "eve@example.com",
        phone: "090-5555-5555",
      },
    ];

    // 同じリストを降順（Z→A）に反転させて準備
    const descendingCustomers = [...ascendingCustomers].reverse();

    // 昇順リストを検証エンジンに入力し、検証を実行
    const ascendingResult = validateSalesData(ascendingCustomers);

    // 降順リストを検証エンジンに入力し、検証を実行
    const descendingResult = validateSalesData(descendingCustomers);

    // 昇順リストの検証結果から検出された問題一覧を取得
    const ascendingIssues = ascendingResult.issues.map((issue) => ({
      issueType: issue.issueType,
      issueContent: issue.issueContent,
      targetCustomerId: issue.targetCustomerId,
    }));

    // 降順リストの検証結果から検出された問題一覧を取得
    const descendingIssues = descendingResult.issues.map((issue) => ({
      issueType: issue.issueType,
      issueContent: issue.issueContent,
      targetCustomerId: issue.targetCustomerId,
    }));

    // 昇順と降順の検証結果が完全に一致することを確認
    expect(ascendingIssues.length).toBe(descendingIssues.length);

    // 同じ問題タイプ、同じ問題内容、同じ対象顧客IDの問題がすべて検出されたことを確認
    ascendingIssues.forEach((ascendingIssue) => {
      const matchingDescendingIssue = descendingIssues.find(
        (descendingIssue) =>
          descendingIssue.issueType === ascendingIssue.issueType &&
          descendingIssue.issueContent === ascendingIssue.issueContent &&
          descendingIssue.targetCustomerId === ascendingIssue.targetCustomerId
      );
      expect(matchingDescendingIssue).toBeDefined();
    });

    // 検証結果の詳細内容が一致することを確認
    expect(ascendingResult.validationStatus).toBe(
      descendingResult.validationStatus
    );
    expect(ascendingResult.totalIssueCount).toBe(
      descendingResult.totalIssueCount
    );
  });
});