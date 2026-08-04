import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-657: [edge] 顧客情報入力検証機能 - 企業規模が定義済みの範囲カテゴリに含まれるとき、入力受け付けが完了する
  test('企業規模が定義済みカテゴリ範囲内のとき入力検証が成功し顧客情報が受け付けられる', () => {
    const validCompanySizeCategories = [
      '大企業',
      '中堅企業',
      '中小企業',
      'スタートアップ'
    ];

    const customerInput = {
      company_name: 'テスト営業株式会社',
      industry: '情報通信',
      company_size: '中堅企業',
      contact_person: '営業太郎',
      email: 'taro@example.com'
    };

    const validationResult = validateCustomerInput(
      customerInput,
      validCompanySizeCategories
    );

    expect(validationResult.status).toBe(200);
    expect(validationResult.validation_passed).toBe(true);
    expect(validationResult.errors).toEqual([]);
    expect(validationResult.normalized_data).toEqual({
      company_name: 'テスト営業株式会社',
      industry: '情報通信',
      company_size: '中堅企業',
      contact_person: '営業太郎',
      email: 'taro@example.com'
    });
  });
});