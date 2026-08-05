import { evaluateJustificationTrustworthiness } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-846
  test('根拠信頼度がちょうど信頼性下限（0.5）のとき根拠判定が成立する', () => {
    const problem_detection_result = {
      problem_id: 'prob_001',
      severity: 'high',
      justification_confidence: 0.5,
      justification_content: '営業担当者の提案内容が標準プロセス段階3から逸脱し、顧客ニーズ適合性が70%低下している',
      action_required: true,
      detected_at: new Date('2024-01-15T10:30:00Z'),
    };

    const result = evaluateJustificationTrustworthiness(problem_detection_result);

    expect(result).toEqual({
      is_justification_valid: true,
      justification_confidence: 0.5,
      trustworthiness_judgment: 'acceptable',
    });
  });
});