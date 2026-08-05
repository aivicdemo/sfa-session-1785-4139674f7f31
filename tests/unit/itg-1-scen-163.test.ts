import { convertSalesProcessToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-163: [normal] 営業プロセス標準書のシステム要件変換機能 - 営業プロセス標準書から複数ステージを抽出して、複数のシステム要件に変換される
  test('営業プロセス標準書のサンプルデータから4つのステージを抽出し、対応するシステム要件が4件生成される', () => {
    const sales_process_definition = {
      process_id: 'proc_001',
      process_name: '営業プロセス標準書',
      version: '1.0.0',
      stages: [
        {
          stage_id: 'stage_lead',
          stage_name: 'リード獲得',
          stage_order: 1,
          description: 'リード情報を収集し、顧客マスタに登録する',
          required_data_fields: ['顧客名', '業種', '連絡先'],
          kpi_threshold: {
            metric_name: 'リード数',
            target_value: 100,
            period: '月次'
          }
        },
        {
          stage_id: 'stage_negotiation',
          stage_name: '商談開始',
          stage_order: 2,
          description: '顧客と初回商談を実施し、ニーズを聴取する',
          required_data_fields: ['商談日時', 'ニーズ概要', '予算感'],
          kpi_threshold: {
            metric_name: '初回商談数',
            target_value: 50,
            period: '月次'
          }
        },
        {
          stage_id: 'stage_proposal',
          stage_name: '提案作成',
          stage_order: 3,
          description: '顧客ニーズに基づいて提案書を作成・提示する',
          required_data_fields: ['提案書内容', '提案日時', '見積金額'],
          kpi_threshold: {
            metric_name: '提案件数',
            target_value: 30,
            period: '月次'
          }
        },
        {
          stage_id: 'stage_contract',
          stage_name: '契約締結',
          stage_order: 4,
          description: '顧客との合意に基づいて契約を締結する',
          required_data_fields: ['契約日時', '契約金額', '契約期間'],
          kpi_threshold: {
            metric_name: '契約件数',
            target_value: 10,
            period: '月次'
          }
        }
      ],
      transition_rules: [
        {
          from_stage_id: 'stage_lead',
          to_stage_id: 'stage_negotiation',
          condition: 'リード情報が完成し、初回接触予定が確定'
        },
        {
          from_stage_id: 'stage_negotiation',
          to_stage_id: 'stage_proposal',
          condition: '初回商談完了し、顧客ニーズが明確化'
        },
        {
          from_stage_id: 'stage_proposal',
          to_stage_id: 'stage_contract',
          condition: '提案書提示から顧客の受諾意思を確認'
        }
      ],
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    };

    const result = convertSalesProcessToSystemRequirements(sales_process_definition);

    expect(result).toHaveLength(4);

    expect(result[0]).toEqual({
      requirement_id: expect.any(String),
      stage_id: 'stage_lead',
      stage_name: 'リード獲得',
      system_requirement_name: 'リード獲得機能の実装',
      system_requirement_description: 'リード情報を収集し、顧客マスタに登録するシステム機能',
      required_modules: ['顧客マスタ管理', 'リード入力画面', 'データ検証ロジック'],
      kpi_spec: {
        metric_name: 'リード数',
        target_value: 100,
        period: '月次'
      },
      stage_order: 1,
      generated_at: expect.any(String)
    });

    expect(result[1]).toEqual({
      requirement_id: expect.any(String),
      stage_id: 'stage_negotiation',
      stage_name: '商談開始',
      system_requirement_name: '商談管理画面の実装',
      system_requirement_description: '顧客と初回商談を実施し、ニーズを聴取するシステム機能',
      required_modules: ['商談記録管理', 'ニーズ入力フォーム', 'スケジュール管理'],
      kpi_spec: {
        metric_name: '初回商談数',
        target_value: 50,
        period: '月次'
      },
      stage_order: 2,
      generated_at: expect.any(String)
    });

    expect(result[2]).toEqual({
      requirement_id: expect.any(String),
      stage_id: 'stage_proposal',
      stage_name: '提案作成',
      system_requirement_name: '提案書生成ロジックの実装',
      system_requirement_description: '顧客ニーズに基づいて提案書を作成・提示するシステム機能',
      required_modules: ['提案書テンプレート管理', '提案生成エンジン', '見積ロジック'],
      kpi_spec: {
        metric_name: '提案件数',
        target_value: 30,
        period: '月次'
      },
      stage_order: 3,
      generated_at: expect.any(String)
    });

    expect(result[3]).toEqual({
      requirement_id: expect.any(String),
      stage_id: 'stage_contract',
      stage_name: '契約締結',
      system_requirement_name: '電子契約連携機能の実装',
      system_requirement_description: '顧客との合意に基づいて契約を締結するシステム機能',
      required_modules: ['契約管理システム', '電子署名連携', '契約書生成'],
      kpi_spec: {
        metric_name: '契約件数',
        target_value: 10,
        period: '月次'
      },
      stage_order: 4,
      generated_at: expect.any(String)
    });

    expect(result.every((req) => req.requirement_id !== null && req.requirement_id !== undefined)).toBe(true);
    expect(result.every((req, idx) => req.stage_order === idx + 1)).toBe(true);
  });
});