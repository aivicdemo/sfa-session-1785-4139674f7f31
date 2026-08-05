import { calculateProposalApproachMatchScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-380: 成功パターンマッチング・提案アプローチ判定機能 - 提案実行タイミングが成功パターンで定義されている場合、営業担当者に提示される', () => {
    const successPatternMaster = {
      pattern_id: 'SUC-001',
      industry: 'IT企業',
      stage: '提案段階',
      execution_timing: '初回接触から5営業日以内',
      match_threshold: 80
    };

    const dealData = {
      customer_industry: 'IT企業',
      current_stage: '提案段階',
      days_since_initial_contact: 4,
      calculated_match_score: 85
    };

    const result = calculateProposalApproachMatchScore(successPatternMaster, dealData);

    expect(result.pattern_id).toBe('SUC-001');
    expect(result.is_matched).toBe(true);
    expect(result.match_score).toBe(85);
    expect(result.execution_timing).toBe('初回接触から5営業日以内');
    expect(result.recommended_execution_date).toBe('本日');
    expect(result.display_message).toBe(
      '推奨提案アプローチ：パターンID=SUC-001、実行タイミング=初回接触から5営業日以内、推奨実行日=本日、マッチ度=85%'
    );
  });
});