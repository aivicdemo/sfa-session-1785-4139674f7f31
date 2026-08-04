import { validateDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-719
  test('業種情報が空のとき推奨生成不可と判定される', () => {
    const inputData = {
      customerName: '株式会社テスト',
      dealAmount: 1000000,
      dealStage: '提案',
      industry: '',
    };

    const result = validateDataCompleteness(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('MISSING_INDUSTRY_INFO');
    expect(result.errorMessage).toBe('業種情報は必須項目です。推奨生成を実行できません。');
  });
});