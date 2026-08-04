import { validateScheduleConstraint } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1409: [edge] 提案内容と顧客制約条件の自動照合機能 - スケジュール制約の開始日と終了日が同日のとき、実装可能性が正しく判定される', () => {
    const schedule_constraint = {
      start_date: '2026-08-01',
      end_date: '2026-08-01',
      constraint_type: 'SCHEDULE_SAME_DAY'
    };

    const proposal_content = {
      proposal_start_date: '2026-08-01',
      proposal_end_date: '2026-08-15'
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85)
    };

    const validation_result = validateScheduleConstraint(
      proposal_content,
      schedule_constraint,
      mock_ai_engine
    );

    expect(validation_result.is_implementable).toBe(true);
    expect(validation_result.constraint_type).toBe('SCHEDULE_SAME_DAY');
    expect(validation_result.score).toBe(0.85);
    expect(validation_result.message).toBe(
      'スケジュール制約の開始日と終了日が同日の場合、提案期間内での即日実装が可能と判定されます。スコア: 0.85'
    );
  });
});