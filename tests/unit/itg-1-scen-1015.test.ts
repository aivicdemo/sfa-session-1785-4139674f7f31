import { evaluateSuccessPatternGuidanceAdoptionCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1015
  test('営業担当者IDが欠落しているとき処理がエラーになること', () => {
    const input_with_null_sales_rep_id = {
      sales_rep_id: null,
      target_department: 'Sales_Dept_A',
      guidance_completion_date: new Date('2024-02-15T10:00:00Z'),
      understanding_score: 85,
      practical_application_status: 'Implemented',
    };

    expect(() =>
      evaluateSuccessPatternGuidanceAdoptionCompletion(
        input_with_null_sales_rep_id as any
      )
    ).toThrow(/営業担当者ID/);
  });
});