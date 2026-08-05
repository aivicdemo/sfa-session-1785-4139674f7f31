import { runTx11Imp1Agent } from '../../src/logic/it-1';
import type { Tx11Imp1AiClient } from '../../src/logic/it-1';

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント', () => {
  // SCEN-1295: [normal] 営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント - 「営業事例の収集・分類・言語化の自動化と例外時のみ人による確認」が自律処理「事例の成功要因・失敗要因を分析・言語化する」を契約どおり実行する
  test('営業事例データ3件を自動抽出・分析し、成功要因・失敗要因を言語化して知識ベースに登録', async () => {
    // Setup: テスト用の営業事例データ
    const business_case_1 = {
      case_id: 'case_001',
      customer_id: 'cust_100',
      sales_stage: 'proposal',
      proposal_content: 'Cloud migration solution with personalized needs assessment',
      contract_status: 'won',
      created_at: new Date('2024-01-10T09:30:00Z'),
    };

    const business_case_2 = {
      case_id: 'case_002',
      customer_id: 'cust_101',
      sales_stage: 'presentation',
      proposal_content: 'Data analytics dashboard with visual templates',
      contract_status: 'won',
      created_at: new Date('2024-01-12T14:15:00Z'),
    };

    const business_case_3 = {
      case_id: 'case_003',
      customer_id: 'cust_102',
      sales_stage: 'negotiation',
      proposal_content: 'ERP implementation with unrealistic delivery timeline',
      contract_status: 'lost',
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    const extracted_cases = [business_case_1, business_case_2, business_case_3];

    // AIクライアントのモック実装
    const ai_client_mock: Tx11Imp1AiClient = {
      analyzeCaseFactors: jest.fn(async (case_text: string) => {
        if (case_text.includes('case_001')) {
          return {
            case_id: 'case_001',
            success_factor: '顧客ニーズの事前ヒアリング',
            classification_accuracy: 95,
            factor_type: 'success',
          };
        }
        if (case_text.includes('case_002')) {
          return {
            case_id: 'case_002',
            success_factor: '提案資料の視覚化',
            classification_accuracy: 92,
            factor_type: 'success',
          };
        }
        if (case_text.includes('case_003')) {
          return {
            case_id: 'case_003',
            success_factor: '納期見積の甘さ',
            classification_accuracy: 88,
            factor_type: 'failure',
          };
        }
        throw new Error('Unknown case');
      }),
    };

    // 既存パターン知識ベーススタブ
    const existing_knowledge_base = [
      {
        pattern_id: 'pat_001',
        factor_name: '顧客ニーズの事前ヒアリング',
        factor_type: 'success',
      },
      {
        pattern_id: 'pat_002',
        factor_name: '提案資料の視覚化',
        factor_type: 'success',
      },
    ];

    // In-memory mock database for knowledge base registration
    const registered_cases: Array<{
      case_id: string;
      factor: string;
      accuracy: number;
      registered_at: Date;
      needs_human_review: boolean;
    }> = [];

    const audit_log: Array<{
      event_type: string;
      event_message: string;
      timestamp: Date;
    }> = [];

    // Mock implementations for database operations
    const mock_extract_cases = jest.fn(async () => extracted_cases);
    const mock_register_knowledge = jest.fn(
      async (case_id: string, factor: string, accuracy: number) => {
        registered_cases.push({
          case_id,
          factor,
          accuracy,
          registered_at: new Date('2024-01-20T10:00:00Z'),
          needs_human_review: accuracy < 80,
        });
      }
    );

    const mock_check_existing_patterns = jest.fn(
      async (factor: string) => {
        return existing_knowledge_base.some(
          (p) => p.factor_name === factor
        );
      }
    );

    const mock_log_audit_event = jest.fn(
      async (event_type: string, event_message: string) => {
        audit_log.push({
          event_type,
          event_message,
          timestamp: new Date('2024-01-20T10:00:00Z'),
        });
      }
    );

    // Run the agent
    const result = await runTx11Imp1Agent(
      {
        ai_client: ai_client_mock,
        extract_cases_fn: mock_extract_cases,
        register_knowledge_fn: mock_register_knowledge,
        check_existing_patterns_fn: mock_check_existing_patterns,
        log_audit_event_fn: mock_log_audit_event,
        accuracy_threshold: 80,
      }
    );

    // Verify: AIエージェントが営業システムスタブからAPI経由で事例データ3件を自動抽出
    expect(mock_extract_cases).toHaveBeenCalledTimes(1);
    expect(extracted_cases).toHaveLength(3);

    // Verify: AIクライアントモックが各事例に対して成功要因・失敗要因の分析・言語化プロンプトを受け取る
    expect(ai_client_mock.analyzeCaseFactors).toHaveBeenCalledTimes(3);

    // Verify: 分析結果が期待値と一致
    // case_1: success factor with 95% accuracy
    expect(registered_cases[0]).toEqual(
      expect.objectContaining({
        case_id: 'case_001',
        factor: '顧客ニーズの事前ヒアリング',
        accuracy: 95,
        needs_human_review: false,
      })
    );

    // case_2: success factor with 92% accuracy
    expect(registered_cases[1]).toEqual(
      expect.objectContaining({
        case_id: 'case_002',
        factor: '提案資料の視覚化',
        accuracy: 92,
        needs_human_review: false,
      })
    );

    // case_3: failure factor with 88% accuracy
    expect(registered_cases[2]).toEqual(
      expect.objectContaining({
        case_id: 'case_003',
        factor: '納期見積の甘さ',
        accuracy: 88,
        needs_human_review: false,
      })
    );

    // Verify: 3件全てが精度閾値80%以上
    expect(registered_cases).toHaveLength(3);
    registered_cases.forEach((reg_case) => {
      expect(reg_case.accuracy).toBeGreaterThanOrEqual(80);
    });

    // Verify: 既存パターン知識ベーススタブとの照合
    expect(mock_check_existing_patterns).toHaveBeenCalledWith(
      '顧客ニーズの事前ヒアリング'
    );
    expect(mock_check_existing_patterns).toHaveBeenCalledWith(
      '提案資料の視覚化'
    );
    expect(mock_check_existing_patterns).toHaveBeenCalledWith(
      '納期見積の甘さ'
    );

    // Verify: エージェント実行ログから監査イベント記録
    expect(mock_log_audit_event).toHaveBeenCalledWith(
      'case_extraction_complete',
      expect.stringContaining('3')
    );
    expect(mock_log_audit_event).toHaveBeenCalledWith(
      'classification_complete',
      expect.stringContaining('自動分類完了')
    );
    expect(mock_log_audit_event).toHaveBeenCalledWith(
      'human_review_required',
      expect.stringContaining('人による確認なし')
    );
    expect(mock_log_audit_event).toHaveBeenCalledWith(
      'knowledge_base_registration',
      expect.stringContaining('3')
    );

    // Verify: 監査ログに『自動処理完了・人確認なし』が記録
    const human_review_events = audit_log.filter(
      (e) => e.event_type === 'human_review_required'
    );
    expect(human_review_events.length).toBeGreaterThan(0);
    expect(human_review_events[0].event_message).toMatch(/人による確認なし/);

    // Verify: 全体の処理完了ステータス
    expect(result).toEqual(
      expect.objectContaining({
        total_cases_processed: 3,
        cases_requiring_human_review: 0,
        knowledge_base_registrations: 3,
        processing_status: 'completed',
      })
    );

    // Verify: データベースに3件の分類結果が永続化
    expect(registered_cases).toHaveLength(3);
    expect(registered_cases.every((c) => c.registered_at !== null)).toBe(true);
  });
});