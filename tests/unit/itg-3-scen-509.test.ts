import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-509
  test('指導実施期限が null のとき、エラーが発生する', () => {
    const invalidInput = {
      salesPersonId: 'SP001',
      guidanceContent: '顧客ニーズのヒアリング精度を向上させるための提案アプローチの改善',
      recommendationBasis: '過去の成功パターンとの照合結果から、初回提案時の質問項目が不足していることが判明',
      guidanceDeadline: null,
      dataQualityScore: 85,
      improvementPriorityRank: 1,
      targetImprovementItems: ['顧客課題の抽出方法', '提案内容の適合度判定'],
    };

    expect(() => decideSalesGuidancePolicy(invalidInput)).toThrow(/guidanceDeadline/);

    try {
      decideSalesGuidancePolicy(invalidInput);
    } catch (error: any) {
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('指導実施期限');
      expect(error.fieldName).toBe('guidanceDeadline');
      expect(error.errorCode).toBe('REQUIRED_FIELD_NULL');
    }
  });
});