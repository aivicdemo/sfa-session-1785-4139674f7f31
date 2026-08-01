import { convertProcessStepsToRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-111: 複数のプロセス段階が入力された場合、全件分の要件仕様が漏れなく生成される', () => {
    const input_process_steps = [
      {
        stage_id: 'STAGE-001',
        stage_name: '顧客ニーズ把握',
        stage_description: '顧客のビジネス課題を理解する段階',
        sequence_order: 1,
      },
      {
        stage_id: 'STAGE-002',
        stage_name: '提案資料作成',
        stage_description: '顧客ニーズに基づいて提案資料を作成する段階',
        sequence_order: 2,
      },
      {
        stage_id: 'STAGE-003',
        stage_name: '契約締結',
        stage_description: '提案が受け入れられ契約を締結する段階',
        sequence_order: 3,
      },
    ];

    const result = convertProcessStepsToRequirements(input_process_steps);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      requirement_id: 'REQ-001',
      requirement_name: '顧客情報管理',
      function_overview: '顧客ニーズ把握段階に対応する顧客情報管理機能',
      priority: 'HIGH',
      related_stage_id: 'STAGE-001',
    });

    expect(result[1]).toEqual({
      requirement_id: 'REQ-002',
      requirement_name: '提案資料管理',
      function_overview: '提案資料作成段階に対応する提案資料管理機能',
      priority: 'HIGH',
      related_stage_id: 'STAGE-002',
    });

    expect(result[2]).toEqual({
      requirement_id: 'REQ-003',
      requirement_name: '契約管理',
      function_overview: '契約締結段階に対応する契約管理機能',
      priority: 'HIGH',
      related_stage_id: 'STAGE-003',
    });

    result.forEach((req) => {
      expect(req).toHaveProperty('requirement_id');
      expect(req).toHaveProperty('requirement_name');
      expect(req).toHaveProperty('function_overview');
      expect(req).toHaveProperty('priority');
    });

    expect(result[0].requirement_id).toBe('REQ-001');
    expect(result[0].requirement_name).toBe('顧客情報管理');
    expect(result[1].requirement_id).toBe('REQ-002');
    expect(result[1].requirement_name).toBe('提案資料管理');
    expect(result[2].requirement_id).toBe('REQ-003');
    expect(result[2].requirement_name).toBe('契約管理');
  });
});