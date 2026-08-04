import { validateDataIntegrity } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  test('SCEN-758: 入力された業種が商談条件マスタに存在しないとき、推奨生成不可と判定される', () => {
    // Arrange
    const mockDealConditionMaster = {
      getIndustryByCode: jest.fn().mockReturnValue(null),
    };

    const inputParams = {
      customerId: 'CUST_12345',
      industryCode: 'INDUSTRY_X999',
      dealAmount: 1000000,
      dealStage: '提案段階',
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };

    // Act
    const validationResult = validateDataIntegrity(
      inputParams,
      mockDealConditionMaster,
      mockAIRecommendationEngine
    );

    // Assert
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.canGenerateRecommendation).toBe(false);
    expect(validationResult.errorCode).toBe('INDUSTRY_NOT_FOUND');
    expect(validationResult.errorMessage).toBe(
      '指定された業種が商談条件マスタに存在しません。推奨生成には業種マスタに登録された業種の選択が必要です。'
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(0);
  });
});