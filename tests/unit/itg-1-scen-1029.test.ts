import { calculateSuccessPatternComplianceScore } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  test('SCEN-1029: 理解度確認テストと実務適用報告の両方が未提出のときエラーになること', () => {
    // Arrange
    const systemLogMessages: string[] = [];
    const originalConsoleError = console.error;
    console.error = jest.fn((message: string) => {
      systemLogMessages.push(message);
    });

    const input = {
      understanding_test_submitted: false,
      practical_application_report_submitted: false,
      employee_id: 'EMP001',
      guideline_id: 'GL001',
    };

    try {
      // Act
      const result = calculateSuccessPatternComplianceScore(input);

      // Assert
      expect(result.error_code).toBe('ERR_INCOMPLETE_SUBMISSION');
      expect(result.error_message).toContain('理解度確認テストと実務適用報告の両方の提出が必須です');
      expect(systemLogMessages).toContainEqual(
        expect.stringContaining('[ERROR] 周知完了判定失敗: 必須項目の提出状態が不足しています')
      );
    } finally {
      console.error = originalConsoleError;
    }
  });
});