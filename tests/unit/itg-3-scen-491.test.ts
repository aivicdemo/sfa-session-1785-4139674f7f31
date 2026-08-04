import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('改善優先度ランク算出機能', () => {
  test('SCEN-491: 影響度が0から100の範囲外のとき、ValidationErrorが発生する', () => {
    // 影響度が-1の場合
    expect(() => {
      calculateImprovementPriorityRank({
        impactScore: -1,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    }).toThrow(/影響度/);

    try {
      calculateImprovementPriorityRank({
        impactScore: -1,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual('ValidationError');
      expect(error.code).toBeDefined();
      expect(error.code).toEqual('INVALID_IMPACT_SCORE');
      expect(error.message).toBeDefined();
      expect(error.message).toContain('影響度は0から100の範囲内である必要があります');
    }

    // 影響度が101の場合
    expect(() => {
      calculateImprovementPriorityRank({
        impactScore: 101,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    }).toThrow(/影響度/);

    try {
      calculateImprovementPriorityRank({
        impactScore: 101,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual('ValidationError');
      expect(error.code).toBeDefined();
      expect(error.code).toEqual('INVALID_IMPACT_SCORE');
      expect(error.message).toBeDefined();
      expect(error.message).toContain('影響度は0から100の範囲内である必要があります');
    }

    // 影響度が0.5（小数）の場合
    expect(() => {
      calculateImprovementPriorityRank({
        impactScore: 0.5,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    }).toThrow(/影響度/);

    try {
      calculateImprovementPriorityRank({
        impactScore: 0.5,
        urgencyScore: 50,
        frequencyScore: 50,
      });
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual('ValidationError');
      expect(error.code).toBeDefined();
      expect(error.code).toEqual('INVALID_IMPACT_SCORE');
      expect(error.message).toBeDefined();
      expect(error.message).toContain('影響度は0から100の範囲内である必要があります');
    }
  });
});