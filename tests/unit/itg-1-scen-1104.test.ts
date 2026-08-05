import { analyzeActionPatternsBySalesRep } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能', () => {
  // SCEN-1104
  test('営業担当者ごとの行動パターン分析結果が時系列で分類・整理される', () => {
    // テストデータ: 営業担当者A、B、Cの行動レコード（2024年1月〜3月）
    const salesRepARecords = [
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-01-08',
        activity_type: 'initial_contact',
        duration_minutes: 15,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-01-15',
        activity_type: 'proposal',
        duration_minutes: 45,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-01-22',
        activity_type: 'followup',
        duration_minutes: 20,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-02-03',
        activity_type: 'initial_contact',
        duration_minutes: 12,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-02-10',
        activity_type: 'proposal',
        duration_minutes: 50,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-02-18',
        activity_type: 'followup',
        duration_minutes: 25,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-03-05',
        activity_type: 'initial_contact',
        duration_minutes: 18,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-03-12',
        activity_type: 'proposal',
        duration_minutes: 55,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-03-20',
        activity_type: 'followup',
        duration_minutes: 30,
      },
      {
        sales_rep_id: 'rep_001',
        activity_date: '2024-03-28',
        activity_type: 'negotiation',
        duration_minutes: 60,
      },
    ];

    const salesRepBRecords = [
      {
        sales_rep_id: 'rep_002',
        activity_date: '2024-01-10',
        activity_type: 'initial_contact',
        duration_minutes: 20,
      },
      {
        sales_rep_id: 'rep_002',
        activity_date: '2024-01-25',
        activity_type: 'proposal',
        duration_minutes: 40,
      },
      {
        sales_rep_id: 'rep_002',
        activity_date: '2024-02-08',
        activity_type: 'followup',
        duration_minutes: 15,
      },
      {
        sales_rep_id: 'rep_002',
        activity_date: '2024-02-20',
        activity_type: 'negotiation',
        duration_minutes: 65,
      },
      {
        sales_rep_id: 'rep_002',
        activity_date: '2024-03-15',
        activity_type: 'proposal',
        duration_minutes: 48,
      },
    ];

    const salesRepCRecords = [
      {
        sales_rep_id: 'rep_003',
        activity_date: '2024-01-12',
        activity_type: 'proposal',
        duration_minutes: 35,
      },
      {
        sales_rep_id: 'rep_003',
        activity_date: '2024-02-05',
        activity_type: 'followup',
        duration_minutes: 22,
      },
      {
        sales_rep_id: 'rep_003',
        activity_date: '2024-03-01',
        activity_type: 'initial_contact',
        duration_minutes: 14,
      },
      {
        sales_rep_id: 'rep_003',
        activity_date: '2024-03-18',
        activity_type: 'negotiation',
        duration_minutes: 70,
      },
    ];

    const mixed_records = [
      ...salesRepARecords,
      ...salesRepBRecords,
      ...salesRepCRecords,
    ];

    // 関数実行
    const result = analyzeActionPatternsBySalesRep(mixed_records);

    // 検証1: 結果が営業担当者ごとにグループ化されていることを確認
    expect(result).toHaveProperty('rep_001');
    expect(result).toHaveProperty('rep_002');
    expect(result).toHaveProperty('rep_003');

    // 検証2: 営業担当者Aの結果が行動パターンの分類ごとにグループ化されていることを確認
    const repAResult = result.rep_001;
    expect(repAResult).toHaveProperty('initial_contact');
    expect(repAResult).toHaveProperty('proposal');
    expect(repAResult).toHaveProperty('followup');
    expect(repAResult).toHaveProperty('negotiation');

    // 検証3: 営業担当者Aの初期接触パターンが時系列（古い順）で整列されていることを確認
    const repA_initial_contact = repAResult.initial_contact;
    expect(repA_initial_contact.length).toBe(3);
    expect(repA_initial_contact[0].activity_date).toBe('2024-01-08');
    expect(repA_initial_contact[1].activity_date).toBe('2024-02-03');
    expect(repA_initial_contact[2].activity_date).toBe('2024-03-05');

    // 検証4: 営業担当者Aの提案パターンが時系列（古い順）で整列されていることを確認
    const repA_proposal = repAResult.proposal;
    expect(repA_proposal.length).toBe(3);
    expect(repA_proposal[0].activity_date).toBe('2024-01-15');
    expect(repA_proposal[1].activity_date).toBe('2024-02-10');
    expect(repA_proposal[2].activity_date).toBe('2024-03-12');

    // 検証5: 営業担当者Aのフォローアップパターンが時系列（古い順）で整列されていることを確認
    const repA_followup = repAResult.followup;
    expect(repA_followup.length).toBe(3);
    expect(repA_followup[0].activity_date).toBe('2024-01-22');
    expect(repA_followup[1].activity_date).toBe('2024-02-18');
    expect(repA_followup[2].activity_date).toBe('2024-03-20');

    // 検証6: 営業担当者Aの交渉パターンが時系列（古い順）で整列されていることを確認
    const repA_negotiation = repAResult.negotiation;
    expect(repA_negotiation.length).toBe(1);
    expect(repA_negotiation[0].activity_date).toBe('2024-03-28');

    // 検証7: 営業担当者Bの結果が行動パターンの分類ごとにグループ化されていることを確認
    const repBResult = result.rep_002;
    expect(repBResult).toHaveProperty('initial_contact');
    expect(repBResult).toHaveProperty('proposal');
    expect(repBResult).toHaveProperty('followup');
    expect(repBResult).toHaveProperty('negotiation');

    // 検証8: 営業担当者Bの初期接触パターンが時系列（古い順）で整列されていることを確認
    const repB_initial_contact = repBResult.initial_contact;
    expect(repB_initial_contact.length).toBe(1);
    expect(repB_initial_contact[0].activity_date).toBe('2024-01-10');

    // 検証9: 営業担当者Bの提案パターンが時系列（古い順）で整列されていることを確認
    const repB_proposal = repBResult.proposal;
    expect(repB_proposal.length).toBe(2);
    expect(repB_proposal[0].activity_date).toBe('2024-01-25');
    expect(repB_proposal[1].activity_date).toBe('2024-03-15');

    // 検証10: 営業担当者Bのフォローアップパターンが時系列（古い順）で整列されていることを確認
    const repB_followup = repBResult.followup;
    expect(repB_followup.length).toBe(1);
    expect(repB_followup[0].activity_date).toBe('2024-02-08');

    // 検証11: 営業担当者Bの交渉パターンが時系列（古い順）で整列されていることを確認
    const repB_negotiation = repBResult.negotiation;
    expect(repB_negotiation.length).toBe(1);
    expect(repB_negotiation[0].activity_date).toBe('2024-02-20');

    // 検証12: 営業担当者Cの結果が行動パターンの分類ごとにグループ化されていることを確認
    const repCResult = result.rep_003;
    expect(repCResult).toHaveProperty('initial_contact');
    expect(repCResult).toHaveProperty('proposal');
    expect(repCResult).toHaveProperty('followup');
    expect(repCResult).toHaveProperty('negotiation');

    // 検証13: 営業担当者Cの初期接触パターンが時系列（古い順）で整列されていることを確認
    const repC_initial_contact = repCResult.initial_contact;
    expect(repC_initial_contact.length).toBe(1);
    expect(repC_initial_contact[0].activity_date).toBe('2024-03-01');

    // 検証14: 営業担当者Cの提案パターンが時系列（古い順）で整列されていることを確認
    const repC_proposal = repCResult.proposal;
    expect(repC_proposal.length).toBe(1);
    expect(repC_proposal[0].activity_date).toBe('2024-01-12');

    // 検証15: 営業担当者Cのフォローアップパターンが時系列（古い順）で整列されていることを確認
    const repC_followup = repCResult.followup;
    expect(repC_followup.length).toBe(1);
    expect(repC_followup[0].activity_date).toBe('2024-02-05');

    // 検証16: 営業担当者Cの交渉パターンが時系列（古い順）で整列されていることを確認
    const repC_negotiation = repCResult.negotiation;
    expect(repC_negotiation.length).toBe(1);
    expect(repC_negotiation[0].activity_date).toBe('2024-03-18');

    // 検証17: 各分類グループ内のレコードが日付の昇順でソートされていることを確認
    const allRepA_records = [
      ...repA_initial_contact,
      ...repA_proposal,
      ...repA_followup,
      ...repA_negotiation,
    ];
    for (let i = 0; i < allRepA_records.length - 1; i++) {
      const currentDate = new Date(allRepA_records[i].activity_date).getTime();
      const nextDate = new Date(allRepA_records[i + 1].activity_date).getTime();
      expect(currentDate).toBeLessThanOrEqual(nextDate);
    }

    // 検証18: 複数営業担当者のデータが各営業担当者で独立した時系列分類グループとして分離されていることを確認
    expect(Object.keys(result).length).toBe(3);
    expect(result.rep_001).not.toEqual(result.rep_002);
    expect(result.rep_001).not.toEqual(result.rep_003);
    expect(result.rep_002).not.toEqual(result.rep_003);

    // 検証19: 営業担当者Aの全レコード数が10であることを確認
    const totalRepA =
      repA_initial_contact.length +
      repA_proposal.length +
      repA_followup.length +
      repA_negotiation.length;
    expect(totalRepA).toBe(10);

    // 検証20: 営業担当者Bの全レコード数が5であることを確認
    const totalRepB =
      repB_initial_contact.length +
      repB_proposal.length +
      repB_followup.length +
      repB_negotiation.length;
    expect(totalRepB).toBe(5);

    // 検証21: 営業担当者Cの全レコード数が4であることを確認
    const totalRepC =
      repC_initial_contact.length +
      repC_proposal.length +
      repC_followup.length +
      repC_negotiation.length;
    expect(totalRepC).toBe(4);

    // 検証22: 結果が正しい構造のオブジェクトであることを確認
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });
});