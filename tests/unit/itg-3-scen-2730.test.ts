import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック', () => {
  // SCEN-2730
  test('商談条件の形式が不正なとき処理が失敗する', () => {
    // 必須フィールド: 顧客ID が null
    expect(() =>
      generateRecommendation({
        customerId: null,
        productCategory: 'software',
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*顧客ID.*必須項目です/);

    // 必須フィールド: 顧客ID が undefined
    expect(() =>
      generateRecommendation({
        customerId: undefined,
        productCategory: 'software',
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*顧客ID.*必須項目です/);

    // 必須フィールド: 顧客ID が空文字列
    expect(() =>
      generateRecommendation({
        customerId: '',
        productCategory: 'software',
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*顧客ID.*必須項目です/);

    // 必須フィールド: 商品カテゴリ が null
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: null,
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*商品カテゴリ.*必須項目です/);

    // 必須フィールド: 商品カテゴリ が undefined
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: undefined,
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*商品カテゴリ.*必須項目です/);

    // 必須フィールド: 商品カテゴリ が空文字列
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: '',
        budgetAmount: 50000,
      })
    ).toThrow(/商談条件の形式が不正です.*商品カテゴリ.*必須項目です/);

    // 必須フィールド: 予算額 が null
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: 'software',
        budgetAmount: null,
      })
    ).toThrow(/商談条件の形式が不正です.*予算額.*必須項目です/);

    // 必須フィールド: 予算額 が undefined
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: 'software',
        budgetAmount: undefined,
      })
    ).toThrow(/商談条件の形式が不正です.*予算額.*必須項目です/);

    // 必須フィールド: 予算額 が空文字列（型不正）
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: 'software',
        budgetAmount: '' as any,
      })
    ).toThrow(/商談条件の形式が不正です.*予算額.*型が不正です/);

    // 必須フィールド: 予算額 が文字列（型不正）
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: 'software',
        budgetAmount: '50000' as any,
      })
    ).toThrow(/商談条件の形式が不正です.*予算額.*型が不正です/);

    // 必須フィールド: 予算額 が object（型不正）
    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        productCategory: 'software',
        budgetAmount: {} as any,
      })
    ).toThrow(/商談条件の形式が不正です.*予算額.*型が不正です/);

    // 複数の不正フィールドがある場合は、最初に検出された不正項目を指摘
    expect(() =>
      generateRecommendation({
        customerId: null,
        productCategory: null,
        budgetAmount: '50000' as any,
      })
    ).toThrow(/商談条件の形式が不正です.*顧客ID.*必須項目です/);
  });
});