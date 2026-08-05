import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-526
  test('営業担当者ごとの行動パターン分析レポート生成機能 - 成功パターンに該当する商談が複数存在する場合、全パターンが重複なく抽出される', () => {
    // 準備: 営業担当者A（ID: SALES_001）に紐付く商談データ
    const sales_person_id = 'SALES_001';
    const analysis_period_months = 6;
    const analysis_end_date = new Date('2024-06-30T23:59:59Z');
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');

    // 成功パターン定義
    const success_pattern_1 = {
      pattern_id: 'PATTERN_001',
      pattern_name: '初回接触→提案→受注',
      steps: ['初回接触', '提案', '受注'],
    };

    const success_pattern_2 = {
      pattern_id: 'PATTERN_002',
      pattern_name: '初回接触→見積提示→受注',
      steps: ['初回接触', '見積提示', '受注'],
    };

    const success_pattern_3 = {
      pattern_id: 'PATTERN_003',
      pattern_name: '紹介→デモ→受注',
      steps: ['紹介', 'デモ', '受注'],
    };

    // 営業担当者Aの過去商談データ: パターン(1)に該当する商談2件
    const deals_pattern_1 = [
      {
        deal_id: 'DEAL_P1_001',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_001',
        progress_steps: [
          {
            step_name: '初回接触',
            step_date: new Date('2024-02-01T10:00:00Z'),
          },
          {
            step_name: '提案',
            step_date: new Date('2024-02-15T14:30:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-02-28T16:00:00Z'),
          },
        ],
        deal_amount: 500000,
      },
      {
        deal_id: 'DEAL_P1_002',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_002',
        progress_steps: [
          {
            step_name: '初回接触',
            step_date: new Date('2024-03-05T09:00:00Z'),
          },
          {
            step_name: '提案',
            step_date: new Date('2024-03-20T13:45:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-04-10T15:30:00Z'),
          },
        ],
        deal_amount: 750000,
      },
    ];

    // パターン(2)に該当する商談2件
    const deals_pattern_2 = [
      {
        deal_id: 'DEAL_P2_001',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_003',
        progress_steps: [
          {
            step_name: '初回接触',
            step_date: new Date('2024-01-10T10:00:00Z'),
          },
          {
            step_name: '見積提示',
            step_date: new Date('2024-01-25T11:00:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-02-05T17:00:00Z'),
          },
        ],
        deal_amount: 1200000,
      },
      {
        deal_id: 'DEAL_P2_002',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_004',
        progress_steps: [
          {
            step_name: '初回接触',
            step_date: new Date('2024-04-08T09:30:00Z'),
          },
          {
            step_name: '見積提示',
            step_date: new Date('2024-04-22T14:00:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-05-10T16:30:00Z'),
          },
        ],
        deal_amount: 900000,
      },
    ];

    // パターン(3)に該当する商談2件
    const deals_pattern_3 = [
      {
        deal_id: 'DEAL_P3_001',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_005',
        progress_steps: [
          {
            step_name: '紹介',
            step_date: new Date('2024-02-12T10:00:00Z'),
          },
          {
            step_name: 'デモ',
            step_date: new Date('2024-02-26T15:00:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-03-15T17:30:00Z'),
          },
        ],
        deal_amount: 650000,
      },
      {
        deal_id: 'DEAL_P3_002',
        sales_person_id: 'SALES_001',
        customer_id: 'CUST_006',
        progress_steps: [
          {
            step_name: '紹介',
            step_date: new Date('2024-05-01T11:00:00Z'),
          },
          {
            step_name: 'デモ',
            step_date: new Date('2024-05-15T13:30:00Z'),
          },
          {
            step_name: '受注',
            step_date: new Date('2024-06-05T18:00:00Z'),
          },
        ],
        deal_amount: 1100000,
      },
    ];

    const all_deals = [
      ...deals_pattern_1,
      ...deals_pattern_2,
      ...deals_pattern_3,
    ];

    // マスタデータ準備: 成功パターン定義
    const success_patterns = [
      success_pattern_1,
      success_pattern_2,
      success_pattern_3,
    ];

    // 実行: 行動パターン分析レポート生成機能を呼び出し
    const report = generateSalesPatternAnalysisReport({
      sales_person_id: sales_person_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      deals: all_deals,
      success_patterns: success_patterns,
    });

    // 検証1: 生成されたレポートが存在することを確認
    expect(report).toBeDefined();
    expect(report).not.toBeNull();

    // 検証2: 成功パターン抽出結果に各パターンが含まれていることを確認
    expect(report.extracted_patterns).toBeDefined();
    expect(Array.isArray(report.extracted_patterns)).toBe(true);

    // 検証3: パターン(1)の抽出結果を検証
    const pattern_1_matches = report.extracted_patterns.filter(
      (match: any) => match.pattern_id === 'PATTERN_001'
    );
    expect(pattern_1_matches.length).toBe(2);
    expect(pattern_1_matches.map((m: any) => m.deal_id).sort()).toEqual([
      'DEAL_P1_001',
      'DEAL_P1_002',
    ]);

    // 検証4: パターン(2)の抽出結果を検証
    const pattern_2_matches = report.extracted_patterns.filter(
      (match: any) => match.pattern_id === 'PATTERN_002'
    );
    expect(pattern_2_matches.length).toBe(2);
    expect(pattern_2_matches.map((m: any) => m.deal_id).sort()).toEqual([
      'DEAL_P2_001',
      'DEAL_P2_002',
    ]);

    // 検証5: パターン(3)の抽出結果を検証
    const pattern_3_matches = report.extracted_patterns.filter(
      (match: any) => match.pattern_id === 'PATTERN_003'
    );
    expect(pattern_3_matches.length).toBe(2);
    expect(pattern_3_matches.map((m: any) => m.deal_id).sort()).toEqual([
      'DEAL_P3_001',
      'DEAL_P3_002',
    ]);

    // 検証6: 全パターン間に重複がないことを確認（合計6件）
    const all_extracted_deal_ids = report.extracted_patterns.map(
      (match: any) => match.deal_id
    );
    const unique_deal_ids = new Set(all_extracted_deal_ids);
    expect(unique_deal_ids.size).toBe(6);
    expect(all_extracted_deal_ids.length).toBe(6);

    // 検証7: 各商談のIDと進捗ステップが正確に対応していることを検証
    for (const extracted_match of report.extracted_patterns) {
      const original_deal = all_deals.find(
        (d: any) => d.deal_id === extracted_match.deal_id
      );
      expect(original_deal).toBeDefined();
      expect(extracted_match.progress_steps).toEqual(
        original_deal.progress_steps
      );
      expect(extracted_match.deal_amount).toBe(original_deal.deal_amount);
    }

    // 検証8: レポートの営業担当者IDが正しいことを確認
    expect(report.sales_person_id).toBe(sales_person_id);

    // 検証9: レポートの分析期間が正しいことを確認
    expect(report.analysis_start_date).toEqual(analysis_start_date);
    expect(report.analysis_end_date).toEqual(analysis_end_date);

    // 検証10: レポートに成功パターン総数が記録されていることを確認
    expect(report.total_success_patterns_extracted).toBe(6);
  });
});