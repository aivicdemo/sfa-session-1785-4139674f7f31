import { extractSuccessPatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能 - 成功パターン抽出の再現性検証', () => {
  test('SCEN-844: 同じ入力条件で成功パターン抽出を2回実行したとき、同じ結果が返される', () => {
    const inputCondition = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      employeeId: 'EMP001',
      successThresholdAmount: 1000000,
    };

    const resultFirst = extractSuccessPatterns(inputCondition);

    const resultSecond = extractSuccessPatterns(inputCondition);

    expect(resultFirst.successCaseCount).toBe(15);
    expect(resultSecond.successCaseCount).toBe(15);
    expect(resultFirst.successCaseCount).toBe(resultSecond.successCaseCount);

    expect(resultFirst.cases).toEqual(resultSecond.cases);

    expect(resultFirst.cases.length).toBe(15);
    resultFirst.cases.forEach((caseItem, index) => {
      expect(caseItem.contractDate).toBe(resultSecond.cases[index].contractDate);
      expect(caseItem.employeeId).toBe(resultSecond.cases[index].employeeId);
      expect(caseItem.contractAmount).toBe(resultSecond.cases[index].contractAmount);
      expect(caseItem.productCode).toBe(resultSecond.cases[index].productCode);
      expect(caseItem.customerId).toBe(resultSecond.cases[index].customerId);
    });

    expect(JSON.stringify(resultFirst)).toBe(JSON.stringify(resultSecond));
  });
});