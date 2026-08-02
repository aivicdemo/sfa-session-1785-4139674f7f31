import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  test('SCEN-642: 複数の重複ペアがすべて統合判定対象に含まれる', () => {
    const customerDatabase = [
      {
        customerId: 'A1',
        name: '田中太郎',
        phone: '090-1111-1111',
        address: '東京都渋谷区',
        email: null,
        companyName: null,
      },
      {
        customerId: 'A2',
        name: '田中太郎',
        phone: '090-1111-1111',
        address: '東京都渋谷区',
        email: null,
        companyName: null,
      },
      {
        customerId: 'B1',
        name: '佐藤花子',
        phone: null,
        address: null,
        email: 'sato@example.com',
        companyName: 'ABC商事',
      },
      {
        customerId: 'B2',
        name: '佐藤花子',
        phone: null,
        address: null,
        email: 'sato@example.com',
        companyName: 'ABC商事',
      },
      {
        customerId: 'C',
        name: '鈴木次郎',
        phone: '090-2222-2222',
        address: null,
        email: null,
        companyName: null,
      },
    ];

    const matchingRules = [
      {
        ruleId: 'rule_exact_match',
        fieldCombination: ['name', 'phone', 'address'],
        matchType: 'exact',
        weight: 1.0,
      },
      {
        ruleId: 'rule_email_company_match',
        fieldCombination: ['name', 'email', 'companyName'],
        matchType: 'exact',
        weight: 1.0,
      },
    ];

    const result = detectDuplicateCustomers({
      customers: customerDatabase,
      rules: matchingRules,
    });

    expect(result.duplicatePairs.length).toBe(2);

    const pairA1A2 = result.duplicatePairs.find(
      (pair) =>
        (pair.customerId1 === 'A1' && pair.customerId2 === 'A2') ||
        (pair.customerId1 === 'A2' && pair.customerId2 === 'A1')
    );
    expect(pairA1A2).toBeDefined();
    expect(pairA1A2?.status).toBe('統合待機中');

    const pairB1B2 = result.duplicatePairs.find(
      (pair) =>
        (pair.customerId1 === 'B1' && pair.customerId2 === 'B2') ||
        (pair.customerId1 === 'B2' && pair.customerId2 === 'B1')
    );
    expect(pairB1B2).toBeDefined();
    expect(pairB1B2?.status).toBe('統合待機中');

    expect(result.integrationJudgmentTargets.length).toBe(2);
    expect(
      result.integrationJudgmentTargets.every(
        (target) => target.status === '統合待機中'
      )
    ).toBe(true);

    const customerCInTargets = result.integrationJudgmentTargets.some(
      (target) =>
        target.customerId1 === 'C' ||
        target.customerId2 === 'C'
    );
    expect(customerCInTargets).toBe(false);
  });
});