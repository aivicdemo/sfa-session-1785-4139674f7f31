import { calculateGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-515: [error] 指導方針算出の入力データ検証機能 - データ品質スコアが0から100の範囲外のとき、エラーが発生する', () => {
    // テストデータ: データ品質スコアが-1の入力オブジェクト
    const invalidInputNegative = {
      dataQualityScore: -1,
      improvementPriorityRank: 'high',
      improvementTargetItems: ['customer_name', 'contact_email'],
    };

    // テストデータ: データ品質スコアが101の入力オブジェクト
    const invalidInputExceeds100 = {
      dataQualityScore: 101,
      improvementPriorityRank: 'medium',
      improvementTargetItems: ['phone_number'],
    };

    // データ品質スコアが-1の場合のテスト
    expect(() => calculateGuidancePolicy(invalidInputNegative)).toThrow(
      /データ品質スコアは0から100の範囲内である必要があります。受け取った値: -1/
    );

    // データ品質スコアが101の場合のテスト
    expect(() => calculateGuidancePolicy(invalidInputExceeds100)).toThrow(
      /データ品質スコアは0から100の範囲内である必要があります。受け取った値: 101/
    );
  });
});