import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('チーム営業品質統計分析機能 - フォローアップ成功率データ空時のエラーハンドリング', () => {
  // SCEN-880: [error] チーム営業品質統計分析機能 - 営業担当者ごとのフォローアップ成功率データが空のとき、エラーになる
  test('営業担当者ごとのフォローアップ成功率データが空配列の場合、DATA_EMPTY_ERRORをスロー', () => {
    // import の関数名は structured.functionName に限定
    const { calculateTeamQualityStatistics } = require('../../src/logic/it-1-br-2-1-1');

    // 入力: 営業担当者ごとのフォローアップ成功率データが空配列
    const followUpSuccessRateData = [];
    const input = {
      followUpSuccessRateData,
      lookbackMonths: 3,
    };

    // 期待結果: DATA_EMPTY_ERROR を含むエラーがスロー
    expect(() => {
      calculateTeamQualityStatistics(input);
    }).toThrow(/DATA_EMPTY_ERROR/);
  });
});