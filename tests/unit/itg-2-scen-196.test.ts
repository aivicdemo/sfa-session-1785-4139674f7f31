import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-196: [normal] 顧客データ重複・不整合検出機能 - 顧客名が1文字異なるとき、重複判定スコアが低下する
  test('顧客名が1文字異なる場合、重複スコアが完全一致時よりも低い', () => {
    // 初期化: 顧客データ重複検出機能
    const duplicateDetectionContext = {
      customers: [] as Array<{
        id: string;
        name: string;
        address: string;
        phone: string;
      }>,
    };

    // 顧客A「田中太郎」を登録
    const customerA = {
      id: 'cust_001',
      name: '田中太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };
    duplicateDetectionContext.customers.push(customerA);

    // 顧客B「田中次郎」（1文字異なる）を登録
    const customerB = {
      id: 'cust_002',
      name: '田中次郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };
    duplicateDetectionContext.customers.push(customerB);

    // 顧客AとBの重複判定を実行
    const partialMatchResult = detectDuplicateCustomers({
      referenceCustomer: customerA,
      targetCustomers: [customerB],
      matchingRules: {
        nameWeight: 0.4,
        addressWeight: 0.3,
        phoneWeight: 0.3,
      },
    });

    // 名前完全一致ペア「鈴木花子」を登録
    const customerC = {
      id: 'cust_003',
      name: '鈴木花子',
      address: '大阪府大阪市',
      phone: '080-9876-5432',
    };
    duplicateDetectionContext.customers.push(customerC);

    const customerD = {
      id: 'cust_004',
      name: '鈴木花子',
      address: '大阪府大阪市',
      phone: '080-9876-5432',
    };
    duplicateDetectionContext.customers.push(customerD);

    // 名前完全一致ペアの重複判定を実行
    const perfectMatchResult = detectDuplicateCustomers({
      referenceCustomer: customerC,
      targetCustomers: [customerD],
      matchingRules: {
        nameWeight: 0.4,
        addressWeight: 0.3,
        phoneWeight: 0.3,
      },
    });

    // 期待結果の検証
    // 1文字異なるペアのスコアは70以下
    expect(partialMatchResult.duplicateScore).toBeLessThanOrEqual(70);

    // 名前完全一致ペアのスコアは95以上
    expect(perfectMatchResult.duplicateScore).toBeGreaterThanOrEqual(95);

    // 1文字異なるペアのスコアが名前完全一致ペアのスコアより低い
    expect(partialMatchResult.duplicateScore).toBeLessThan(
      perfectMatchResult.duplicateScore
    );
  });
});