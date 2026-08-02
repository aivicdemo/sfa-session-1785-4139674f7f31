import { detectAndClassifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-556
  test("重複データリストに異なる順序で含まれるペア(顧客A-B と B-A)が同一と判定されて1件の分類結果に統合される", () => {
    const customerA = {
      customerId: "CUST_A",
      name: "顧客A",
      email: "customerA@example.com",
      phone: "090-1234-5678",
    };

    const customerB = {
      customerId: "CUST_B",
      name: "顧客B",
      email: "customerB@example.com",
      phone: "090-1234-5679",
    };

    const duplicatePairs = [
      {
        customerId1: "CUST_A",
        customerId2: "CUST_B",
        matchScore: 0.95,
      },
      {
        customerId1: "CUST_B",
        customerId2: "CUST_A",
        matchScore: 0.95,
      },
    ];

    const customerMap = new Map([
      ["CUST_A", customerA],
      ["CUST_B", customerB],
    ]);

    const result = detectAndClassifyDuplicateCustomers(
      duplicatePairs,
      customerMap
    );

    const duplicateGroups = result.classificationResult;

    const groupContainingAAndB = duplicateGroups.find(
      (group) =>
        (group.customerIdList.includes("CUST_A") &&
          group.customerIdList.includes("CUST_B")) ||
        (group.customerIdList.includes("CUST_B") &&
          group.customerIdList.includes("CUST_A"))
    );

    expect(groupContainingAAndB).toBeDefined();

    const matchingGroupCount = duplicateGroups.filter(
      (group) =>
        group.customerIdList.includes("CUST_A") &&
        group.customerIdList.includes("CUST_B")
    ).length;

    expect(matchingGroupCount).toBe(1);

    expect(groupContainingAAndB?.customerIdList).toContain("CUST_A");
    expect(groupContainingAAndB?.customerIdList).toContain("CUST_B");
    expect(groupContainingAAndB?.duplicateCount).toBe(2);
  });
});