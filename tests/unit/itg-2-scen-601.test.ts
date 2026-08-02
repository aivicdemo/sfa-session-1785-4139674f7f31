import { validateAmount } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-601
  test('[edge] 妥当性検証で金額が0の場合、不合格と判定される', () => {
    const salesData = {
      amount: 0
    };

    const validationResult = validateAmount(salesData);

    expect(validationResult.status).toBe('不合格');
    expect(validationResult.errorMessage).toMatch(/金額は0より大きい値を設定してください/);
  });
});