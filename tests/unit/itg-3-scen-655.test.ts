import { validateCustomerInformation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-655: [edge] 顧客情報入力検証機能 - 業種が定義済みのマスタ値に含まれるとき、入力受け付けが完了する
  test('業種が定義済みマスタ値に含まれ、必須項目をすべて満たすとき、検証が完了ステータスで返却される', () => {
    const validCustomerInput = {
      customerName: '株式会社サンプル',
      industry: '情報通信業',
      scale: 'medium',
      address: '東京都千代田区丸の内1-1-1',
      contactPerson: '営業太郎',
      contactEmail: 'sales@sample.com',
      contactPhone: '03-1234-5678',
    };

    const result = validateCustomerInformation(validCustomerInput);

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.errorMessage).toBeUndefined();
    expect(result.validationComplete).toBe(true);
  });
});