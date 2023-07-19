-- name: AlertLogInsertEP :exec
INSERT INTO alert_logs(alert_id, event, sub_type, sub_user_id, sub_integration_key_id, sub_hb_monitor_id, sub_channel_id, sub_classifier, meta, message)
SELECT
    a.id,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
FROM
    alerts a
    JOIN services svc ON svc.id = a.service_id
        AND svc.escalation_policy_id = ANY ($1)
WHERE
    a.status != 'closed';

-- name: AlertLogInsertSvc :exec
INSERT INTO alert_logs(alert_id, event, sub_type, sub_user_id, sub_integration_key_id, sub_hb_monitor_id, sub_channel_id, sub_classifier, meta, message)
SELECT
    a.id,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
FROM
    alerts a
WHERE
    a.service_id = $1
    AND (($2 = 'closed'::enum_alert_log_event
            AND a.status != 'closed')
        OR ($2::enum_alert_log_event IN ('acknowledged', 'notification_sent')
            AND a.status = 'triggered'));

-- name: AlertLogInsertMany :exec
INSERT INTO alert_logs(alert_id, event, sub_type, sub_user_id, sub_integration_key_id, sub_hb_monitor_id, sub_channel_id, sub_classifier, meta, message)
SELECT
    unnest,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
FROM
    unnest($1::bigint[]);

