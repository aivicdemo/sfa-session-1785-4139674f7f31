import { convertProcessStandardToRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-187: [error] 営業プロセス標準書の要件仕様変換機能 - IT部門の権限情報が null のとき、権限不足エラーが発生する
  test('should throw PERMISSION_DENIED error when IT department authorization info is null', () => {
    const processStandardData = {
      process_id: 'PROC-001',
      process_name: '営業プロセス標準書',
      stages: [
        {
          stage_id: 'STAGE-001',
          stage_name: '初回接触',
          description: '顧客との初めての接触段階',
          required_fields: ['customer_name', 'contact_date'],
        },
        {
          stage_id: 'STAGE-002',
          stage_name: '提案',
          description: '顧客への提案段階',
          required_fields: ['proposal_content', 'proposal_date'],
        },
      ],
      process_flow: [
        {
          from_stage: 'STAGE-001',
          to_stage: 'STAGE-002',
          condition: '顧客が興味を示した場合',
        },
      ],
      kpi_criteria: [
        {
          kpi_id: 'KPI-001',
          kpi_name: '初回接触成功率',
          target_value: 0.8,
        },
      ],
    };

    const it_department_auth = null;

    expect(() =>
      convertProcessStandardToRequirements(processStandardData, it_department_auth),
    ).toThrow(/権限/);
  });
});