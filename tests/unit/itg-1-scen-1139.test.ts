import { describe, test, expect } from '@jest/globals';
import { getAnalysisResultDetail } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1139
  test('行動パターン分析結果IDが欠落しているとき、処理がエラーになること', () => {
    const analysisResultId = null;

    expect(() => {
      getAnalysisResultDetail(analysisResultId);
    }).toThrow(/行動パターン分析結果ID/);
  });
});