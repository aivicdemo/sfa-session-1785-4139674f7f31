import { calculateImprovementInstructionPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-304: [edge] 行動パターン分析と改善指導優先順位判定機能 - 改善指導の優先順位が降順（乖離度大→小）で整列される際、逆順で入力された場合でも正しく順序付けされる
  test('改善指導の優先順位が乖離度の降順で正しく整列される（逆順入力の場合）', () => {
    // 乖離度の昇順（小→大）で逆順入力：15%、25%、35%、45%、55%
    const improvement_instructions = [
      {
        sales_staff_id: 'staff_001',
        deviation_rate: 15,
        instruction_content: '初回接触頻度を増加させる',
        instruction_id: 'instr_001',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        sales_staff_id: 'staff_001',
        deviation_rate: 25,
        instruction_content: '提案内容の質を向上させる',
        instruction_id: 'instr_002',
        created_at: new Date('2024-01-15T10:15:00Z'),
      },
      {
        sales_staff_id: 'staff_001',
        deviation_rate: 35,
        instruction_content: 'フォローアップ間隔を短縮する',
        instruction_id: 'instr_003',
        created_at: new Date('2024-01-15T10:30:00Z'),
      },
      {
        sales_staff_id: 'staff_001',
        deviation_rate: 45,
        instruction_content: '顧客反応の分析を強化する',
        instruction_id: 'instr_004',
        created_at: new Date('2024-01-15T10:45:00Z'),
      },
      {
        sales_staff_id: 'staff_001',
        deviation_rate: 55,
        instruction_content: 'プロセス遵守度を改善する',
        instruction_id: 'instr_005',
        created_at: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    // 行動パターン分析機能を実行し、改善指導優先順位判定機能をトリガーする
    const result = calculateImprovementInstructionPriority(improvement_instructions);

    // 期待結果：改善指導一覧が乖離度の降順（大→小）で整列されており、
    // 最初から順に乖離度55%、45%、35%、25%、15%の順序で表示される
    expect(result).toHaveLength(5);
    expect(result[0].deviation_rate).toBe(55);
    expect(result[0].instruction_id).toBe('instr_005');
    expect(result[1].deviation_rate).toBe(45);
    expect(result[1].instruction_id).toBe('instr_004');
    expect(result[2].deviation_rate).toBe(35);
    expect(result[2].instruction_id).toBe('instr_003');
    expect(result[3].deviation_rate).toBe(25);
    expect(result[3].instruction_id).toBe('instr_002');
    expect(result[4].deviation_rate).toBe(15);
    expect(result[4].instruction_id).toBe('instr_001');
  });
});