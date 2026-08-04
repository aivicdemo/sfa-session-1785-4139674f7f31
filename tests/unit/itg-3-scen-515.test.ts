import { calculateGuidancePolicies } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針算出入力データ検証', () => {
  test('SCEN-515: データ品質スコアが範囲外の場合はValidationErrorがスローされる', () => {
    const invalidInputNegative = {
      dataQualityScore: -1,
      improvementPriorityRank: 'HIGH',
      targetItems: ['顧客情報', '商談情報']
    };

    const invalidInputExceeded = {
      dataQualityScore: 101,
      improvementPriorityRank: 'HIGH',
      targetItems: ['顧客情報', '商談情報']
    };

    expect(() => calculateGuidancePolicies(invalidInputNegative)).toThrow(
      /データ品質スコアは0から100の範囲内である必要があります。受け取った値: -1/
    );

    expect(() => calculateGuidancePolicies(invalidInputExceeded)).toThrow(
      /データ品質スコアは0から100の範囲内である必要があります。受け取った値: 101/
    );
  });
});