import { verifyInferencePrecisionWithDuplicateCandidates } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-412
  test('検証対象期間内に顧客重複候補レコードが存在するとき、統合判定前の状態を検証対象に含める', () => {
    // テストデータ準備: 検証対象期間を設定
    const verificationStartDate = new Date('2026-01-01T00:00:00Z');
    const verificationEndDate = new Date('2026-01-31T23:59:59Z');

    // テストデータ準備: 顧客重複候補レコードを2件作成
    // レコードA: 統合判定済み、作成日2026-01-15
    const recordA = {
      candidateId: 'DUP-001',
      customerId: 'C001',
      createdAt: new Date('2026-01-15T10:30:00Z'),
      status: '統合判定済み',
      sourceRecordId: 'SRC-001',
      targetRecordId: 'TGT-001',
      mergedAt: new Date('2026-01-16T14:00:00Z'),
    };

    // レコードB: 統合判定前、作成日2026-01-20
    const recordB = {
      candidateId: 'DUP-002',
      customerId: 'C001',
      createdAt: new Date('2026-01-20T09:15:00Z'),
      status: '統合判定前',
      sourceRecordId: 'SRC-002',
      targetRecordId: 'TGT-002',
      mergedAt: null,
    };

    const duplicateCandidateRecords = [recordA, recordB];

    // 推論精度検証機能を呼び出し
    const result = verifyInferencePrecisionWithDuplicateCandidates({
      verificationStartDate,
      verificationEndDate,
      duplicateCandidateRecords,
    });

    // 返却されたレコード一覧を確認
    expect(result.verificationResults).toBeDefined();
    expect(Array.isArray(result.verificationResults.records)).toBe(true);

    // レコードAが検証対象に含まれていることを確認
    const foundRecordA = result.verificationResults.records.find(
      (r) => r.candidateId === 'DUP-001',
    );
    expect(foundRecordA).toBeDefined();
    expect(foundRecordA?.customerId).toBe('C001');
    expect(foundRecordA?.createdAt).toEqual(new Date('2026-01-15T10:30:00Z'));
    expect(foundRecordA?.status).toBe('統合判定済み');

    // レコードBが検証対象に含まれていることを確認
    const foundRecordB = result.verificationResults.records.find(
      (r) => r.candidateId === 'DUP-002',
    );
    expect(foundRecordB).toBeDefined();
    expect(foundRecordB?.customerId).toBe('C001');
    expect(foundRecordB?.createdAt).toEqual(new Date('2026-01-20T09:15:00Z'));
    expect(foundRecordB?.status).toBe('統合判定前');

    // レコードAとレコードBが同一顧客の重複候補グループとして関連付けられている
    expect(result.verificationResults.duplicateGroups).toBeDefined();
    const customerC001Group = result.verificationResults.duplicateGroups.find(
      (group) => group.customerId === 'C001',
    );
    expect(customerC001Group).toBeDefined();
    expect(customerC001Group?.candidateIds).toContain('DUP-001');
    expect(customerC001Group?.candidateIds).toContain('DUP-002');
    expect(customerC001Group?.candidateIds.length).toBe(2);
  });
});