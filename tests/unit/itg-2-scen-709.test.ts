import { calculateSizeCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-709: 提案資料と顧客ニーズの適合度スコア化機能 - 顧客規模が部分的に一致するとき、規模適合スコアが中間値になる', () => {
    const customer_need_min_employees = 100;
    const customer_need_max_employees = 500;
    const proposal_min_employees = 200;
    const proposal_max_employees = 600;

    const overlap_min = Math.max(customer_need_min_employees, proposal_min_employees);
    const overlap_max = Math.min(customer_need_max_employees, proposal_max_employees);
    const overlap_range = overlap_max - overlap_min;
    const customer_range = customer_need_max_employees - customer_need_min_employees;

    const expected_score = customer_range > 0 ? overlap_range / customer_range : 0;

    const score = calculateSizeCompatibilityScore(
      customer_need_min_employees,
      customer_need_max_employees,
      proposal_min_employees,
      proposal_max_employees
    );

    expect(score).toBe(0.5);
  });
});