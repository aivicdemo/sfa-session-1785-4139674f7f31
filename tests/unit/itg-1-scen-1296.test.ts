import { runTx11Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント', () => {
  // SCEN-1296: [normal] 既存の成功パターンと照合し、新規パターンを判定する
  test('既存パターン照合エンジンが営業事例を分類し、マッチスコア・新規パターン判定フラグ・エスカレーション要否を正確に返す', async () => {
    fetchMock.resetMocks();

    // テスト用営業事例データセット
    const business_cases_input = [
      {
        case_id: 'CASE_A',
        sales_stage: 'proposal',
        industry: 'manufacturing',
        customer_size: 'large',
        success_factors_text: '顧客の経営層が導入効果を理解し、予算承認が迅速に進んだ。導入支援体制も充実していた。',
        contract_result: 'won'
      },
      {
        case_id: 'CASE_B',
        sales_stage: 'negotiation',
        industry: 'finance',
        customer_size: 'medium',
        success_factors_text: 'システム統合の複雑性に対応し、カスタマイズを提案した。検証期間は2ヶ月要した。',
        contract_result: 'won'
      },
      {
        case_id: 'CASE_C',
        sales_stage: 'initial_contact',
        industry: 'healthcare',
        customer_size: 'small',
        success_factors_text: 'コンプライアンス要件の厳格性が業界固有の課題であり、当社ソリューションがそれを解決する点を明確に説明したことが受注の決定打となった。',
        contract_result: 'won'
      }
    ];

    // 既存の成功パターン参照ファイル（メモリ内）
    const success_patterns_reference = [
      {
        pattern_id: 'PATTERN_P001',
        sales_stage: 'proposal',
        industry: 'manufacturing',
        customer_size: 'large',
        factor_description: '経営層承認・予算承認迅速化',
        success_rate: 0.87
      },
      {
        pattern_id: 'PATTERN_P002',
        sales_stage: 'proposal',
        industry: 'manufacturing',
        customer_size: 'medium',
        factor_description: '段階的導入・ROI明示',
        success_rate: 0.79
      },
      {
        pattern_id: 'PATTERN_P003',
        sales_stage: 'negotiation',
        industry: 'finance',
        customer_size: 'large',
        factor_description: 'システム統合複雑性対応',
        success_rate: 0.82
      },
      {
        pattern_id: 'PATTERN_P004',
        sales_stage: 'negotiation',
        industry: 'finance',
        customer_size: 'medium',
        factor_description: 'カスタマイズ提案・検証期間短縮',
        success_rate: 0.75
      },
      {
        pattern_id: 'PATTERN_P005',
        sales_stage: 'initial_contact',
        industry: 'retail',
        customer_size: 'small',
        factor_description: '小規模店舗向けシンプル導入',
        success_rate: 0.68
      }
    ];

    // フェイク AI クライアントの応答設定
    // 事例A: PATTERN_P001に90%マッチ → 既存パターン
    // 事例B: PATTERN_P004に60%マッチ → エスカレーション対象
    // 事例C: 既存パターンに該当しない（医療業界固有、コンプライアンス要件） → 新規パターン候補
    const ai_client_mock_response = {
      classification_results: [
        {
          case_id: 'CASE_A',
          existing_pattern_match: true,
          matched_pattern_id: 'PATTERN_P001',
          match_score: 90,
          escalation_required: false,
          new_pattern_candidate: false,
          reasoning: '営業段階(proposal)、業種(manufacturing)、顧客規模(large)の組み合わせにおいて、経営層承認と予算承認迅速化という成功要因が既存パターンP001と一致。マッチスコア90%で基準閾値(80%)を超過。'
        },
        {
          case_id: 'CASE_B',
          existing_pattern_match: true,
          matched_pattern_id: 'PATTERN_P004',
          match_score: 60,
          escalation_required: true,
          new_pattern_candidate: false,
          reasoning: '営業段階(negotiation)、業種(finance)、顧客規模(medium)の組み合わせにおいて、カスタマイズ提案という要因は既存パターンP004と部分的に一致するが、マッチスコア60%は基準閾値(80%)未満のため人による確認が必要。'
        },
        {
          case_id: 'CASE_C',
          existing_pattern_match: false,
          matched_pattern_id: null,
          match_score: 0,
          escalation_required: true,
          new_pattern_candidate: true,
          reasoning: '営業段階(initial_contact)、業種(healthcare)、顧客規模(small)の組み合わせは既存パターン参照中に該当事例なし。医療業界固有のコンプライアンス要件対応という成功要因は既存パターンに該当しない新規パターン候補。'
        }
      ],
      audit_log: {
        timestamp: '2024-01-15T11:00:00Z',
        processed_case_count: 3,
        classification_counts: {
          existing_pattern_classified: 1,
          escalation_required_count: 2,
          new_pattern_candidate_count: 1
        },
        reference_file_unchanged: true,
        ai_client_call_count: 3
      }
    };

    fetchMock.mockResponseOnce(JSON.stringify(ai_client_mock_response), { status: 200 });

    // runTx11Imp1Agent オーケストレータの初期化と実行
    const result = await runTx11Imp1Agent({
      business_cases: business_cases_input,
      success_patterns_reference: success_patterns_reference,
      match_score_threshold: 80,
      escalation_score_threshold: 60
    });

    // 戻り値のスキーマ検証
    expect(result).toHaveProperty('classification_results');
    expect(Array.isArray(result.classification_results)).toBe(true);
    expect(result.classification_results.length).toBe(3);

    // 各事例の分類結果検証
    const case_a_result = result.classification_results.find((r: any) => r.case_id === 'CASE_A');
    expect(case_a_result).toBeDefined();
    expect(case_a_result.existing_pattern_match).toBe(true);
    expect(case_a_result.matched_pattern_id).toBe('PATTERN_P001');
    expect(case_a_result.match_score).toBe(90);
    expect(case_a_result.escalation_required).toBe(false);
    expect(case_a_result.new_pattern_candidate).toBe(false);
    expect(typeof case_a_result.reasoning).toBe('string');
    expect(case_a_result.reasoning.length).toBeGreaterThan(0);

    // 事例A: マッチスコア(90%)が基準閾値(80%)以上であることを確認
    expect(case_a_result.match_score).toBeGreaterThanOrEqual(80);

    // 事例B: マッチスコア(60%)が基準閾値(80%)未満でエスカレーション対象フラグがtrue
    const case_b_result = result.classification_results.find((r: any) => r.case_id === 'CASE_B');
    expect(case_b_result).toBeDefined();
    expect(case_b_result.match_score).toBe(60);
    expect(case_b_result.match_score).toBeLessThan(80);
    expect(case_b_result.escalation_required).toBe(true);
    expect(case_b_result.existing_pattern_match).toBe(true);
    expect(case_b_result.new_pattern_candidate).toBe(false);

    // 事例C: 既存パターンに該当しない新規パターン候補
    const case_c_result = result.classification_results.find((r: any) => r.case_id === 'CASE_C');
    expect(case_c_result).toBeDefined();
    expect(case_c_result.existing_pattern_match).toBe(false);
    expect(case_c_result.matched_pattern_id).toBeNull();
    expect(case_c_result.match_score).toBe(0);
    expect(case_c_result.new_pattern_candidate).toBe(true);
    expect(case_c_result.escalation_required).toBe(true);

    // 新規パターン候補事例の根拠テキストが具体的な因果関係を記述していることを確認
    expect(case_c_result.reasoning).toMatch(/医療/);
    expect(case_c_result.reasoning).toMatch(/コンプライアンス/);
    expect(case_c_result.reasoning).toMatch(/新規パターン/);

    // 監査ログの検証
    expect(result).toHaveProperty('audit_log');
    expect(result.audit_log).toHaveProperty('timestamp');
    expect(result.audit_log.timestamp).toBe('2024-01-15T11:00:00Z');
    expect(result.audit_log.processed_case_count).toBe(3);
    expect(result.audit_log.classification_counts.existing_pattern_classified).toBe(1);
    expect(result.audit_log.classification_counts.escalation_required_count).toBe(2);
    expect(result.audit_log.classification_counts.new_pattern_candidate_count).toBe(1);

    // 参照ファイルが読み取り専用操作であることを確認
    expect(result.audit_log.reference_file_unchanged).toBe(true);

    // フェイク AI クライアントの呼び出し回数が期待値と一致
    expect(result.audit_log.ai_client_call_count).toBe(3);

    // fetch の呼び出しが正確に行われたか検証
    expect(fetchMock.calls().length).toBe(1);
    const fetch_call = fetchMock.calls()[0];
    expect(fetch_call[0]).toMatch(/pattern-matching|classification/);
  });
});