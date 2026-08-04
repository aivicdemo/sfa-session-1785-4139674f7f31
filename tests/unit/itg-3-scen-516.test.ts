import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { validateDataQualityReportInput } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート指導方針算出', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // SCEN-516
  test('改善優先度ランクが定義済み値以外のとき、ValidationErrorが発生する', () => {
    const invalidPriorityRanks = [0, 4, -1, 999, null, undefined, 'invalid'];

    invalidPriorityRanks.forEach((invalidRank) => {
      const inputData = {
        dataQualityScore: 78,
        improvementPriorityRank: invalidRank,
        improvementTargetItems: ['顧客名', '業種'],
      };

      try {
        validateDataQualityReportInput(inputData);
        // エラーが発生しない場合は失敗
        expect(true).toBe(false);
      } catch (error: any) {
        // (1) ValidationError例外が発生すること
        expect(error.name).toBe('ValidationError');

        // (2) エラーコードが「INVALID_PRIORITY_RANK」であること
        expect(error.code).toBe('INVALID_PRIORITY_RANK');

        // (3) エラーメッセージに「改善優先度ランクは1、2、3のいずれかである必要があります」と明記されていること
        expect(error.message).toMatch(/改善優先度ランクは1、2、3のいずれかである必要があります/);

        // (5) 入力値がそのままエラーログに記録されること
        expect(error.inputValue).toBe(invalidRank);
      }
    });

    // (4) 以降の処理が実行されないことを確認（エラーログが記録されていることで検証）
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});