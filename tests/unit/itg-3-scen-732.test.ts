import { validateDataCompleteness } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨生成前データ完全性判定機能', () => {
  // SCEN-732
  test('[error] 商談条件マスタに当該顧客の制約条件がないとき推奨生成不可と判定される', () => {
    const customerId = 'CUST-001';
    const dealId = 'DEAL-20250801-001';

    const result = validateDataCompleteness({
      customerId,
      dealId,
      customerConstraints: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.canGenerateRecommendation).toBe(false);
    expect(result.errorCode).toBe('MISSING_CUSTOMER_CONSTRAINTS');
    expect(result.errorMessage).toBe(
      '顧客ID:CUST-001 の商談条件マスタに制約条件が登録されていません。推奨生成に必要なマスタデータが不足しているため、推奨生成処理は実行できません。'
    );
    expect(result.missingDataFields).toEqual(['customerConstraints']);
  });
});