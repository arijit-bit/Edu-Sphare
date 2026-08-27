export async function audit(client, { schoolId, actorId, action, entityType, entityId, before = null, after = null, requestId, ip }) {
  await client.query(
    `INSERT INTO audit_events (school_id, actor_id, action, entity_type, entity_id, before_data, after_data, request_id, ip_address)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [schoolId, actorId, action, entityType, entityId, before, after, requestId, ip]
  );
}
