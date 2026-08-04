import { decideGuidancePolicyForSalesStaff } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  // SCEN-509
  test('[error] 指導実施期限が null のとき、エラーが発生する', () => {
    const salesStaffId = 'STAFF-001';
    const guidanceContent = '顧客ニーズ分析スキルの強化';
    const recommendationBasis = '過去3件の商談で顧客ニーズ抽出が不十分だったパターンを検出';
    const guidanceDeadline = null;

    const testInput = {
      salesStaffId,
      guidanceContent,
      recommendationBasis,
      guidanceDeadline,
    };

    expect(() => decideGuidancePolicyForSalesStaff(testInput)).toThrow(
      expect.objectContaining({
        errorType: 'ValidationError',
        message: expect.stringContaining('指導実施期限（guidanceDeadline）は必須項目です。null は許可されません'),
        fieldName: 'guidanceDeadline',
        errorCode: 'REQUIRED_FIELD_NULL',
      })
    );
  });
});