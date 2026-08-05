import { judgeSuccessPatternGuidanceCompleteness } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1016: [error] 成功パターン適用ガイドライン周知完了判定機能 - 営業担当者IDが空文字列のとき処理がエラーになること
  test('営業担当者IDが空文字列のとき、エラーコード INVALID_SALES_PERSON_ID を返すこと', () => {
    const result = judgeSuccessPatternGuidanceCompleteness({
      sales_person_id: '',
      guidance_acknowledged_date: new Date('2024-01-15T10:00:00Z'),
      comprehension_test_score: 85,
      practical_application_reported: true,
      evaluation_date: new Date('2024-01-20T10:00:00Z'),
    });

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('code', 'INVALID_SALES_PERSON_ID');
    expect(result.error).toHaveProperty('message');
    expect(result.error.message).toMatch(/営業担当者ID/);
    expect(result.judgement_result).toBeUndefined();
  });
});