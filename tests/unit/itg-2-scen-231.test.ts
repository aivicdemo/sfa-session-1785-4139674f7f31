import { convertProcessStandardToRequirements } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 要件仕様変換処理', () => {
  // SCEN-231
  test('判定基準が0件のとき、要件仕様変換処理が完了しない', () => {
    const input = {
      criteria_records: [],
      process_standard_id: 'PS-001',
      conversion_mode: 'standard_to_requirements' as const,
    };

    const result = convertProcessStandardToRequirements(input);

    expect(result.status).toBe('failed');
    expect(result.error_code).toBe('ERR_NO_CRITERIA_FOUND');
    expect(result.error_message).toContain('判定基準が0件のため処理を継続できません');
  });
});