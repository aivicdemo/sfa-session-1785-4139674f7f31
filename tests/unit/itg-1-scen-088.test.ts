import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { convertSalesProcessLogExtractionRangeToItInstruction } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能 - IT部門指示への変換', () => {
  // SCEN-088
  test('確定された抽出範囲がIT部門への指示として正しく変換される', () => {
    // Arrange
    const extractionRangeInput = {
      startDateTime: new Date('2024-01-01T00:00:00Z'),
      endDateTime: new Date('2024-01-31T23:59:59Z'),
      targetDepartmentCode: 'A001',
    };

    const systemCurrentDateTime = new Date('2024-01-15T10:30:00Z');

    // Act
    const result = convertSalesProcessLogExtractionRangeToItInstruction(
      extractionRangeInput,
      systemCurrentDateTime
    );

    // Assert - 指示ID が自動採番されている
    expect(result.instructionId).toBeDefined();
    expect(typeof result.instructionId).toBe('string');
    expect(result.instructionId.length).toBeGreaterThan(0);

    // Assert - 指示日時 = システム現在時刻
    expect(result.instructionDateTime).toEqual(systemCurrentDateTime);

    // Assert - ログ抽出開始日時
    expect(result.logExtractionStartDateTime).toEqual(new Date('2024-01-01T00:00:00Z'));

    // Assert - ログ抽出終了日時
    expect(result.logExtractionEndDateTime).toEqual(new Date('2024-01-31T23:59:59Z'));

    // Assert - 対象部門コード
    expect(result.targetDepartmentCode).toBe('A001');

    // Assert - 指示ステータス = 未実行
    expect(result.instructionStatus).toBe('未実行');

    // Assert - 戻り値の型が IT 部門連携テーブル登録用フォーマット
    expect(result).toHaveProperty('instructionId');
    expect(result).toHaveProperty('instructionDateTime');
    expect(result).toHaveProperty('logExtractionStartDateTime');
    expect(result).toHaveProperty('logExtractionEndDateTime');
    expect(result).toHaveProperty('targetDepartmentCode');
    expect(result).toHaveProperty('instructionStatus');
  });
});