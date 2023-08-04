import sql from '@/lib/postgres'
import dayjs from 'dayjs'

export const getContributionByType = async (annotator_id: string) => {
    return sql`
        select 'bounding box' as name, count(*) as value
        from annotation
                 left join crop c on annotation.annotation_id = c.annotation_id
        where annotator_id = ${annotator_id};
`
}

export const getContributionsByDay = async (annotator_id: string) => {
    const now = dayjs()
    const lastWeekStart = now.subtract(7, 'day').startOf('day').unix()
    const today = now.startOf('day').unix()
    return sql`
        WITH all_days
                 AS (SELECT (CURRENT_DATE - INTERVAL '13 days') ::date + generate_series(0, 13) AS date), annotation_counts AS (
        SELECT TO_CHAR(DATE_TRUNC('day', to_timestamp(timestamp)), 'yyyy-MM-dd'):: date AS date, COUNT (*) AS annotation_count
        FROM annotation
        WHERE timestamp >= EXTRACT (epoch FROM (CURRENT_DATE - INTERVAL '14 days')) -- Start date 14 days ago
          AND timestamp <= EXTRACT (epoch FROM CURRENT_DATE + INTERVAL '1 day')     -- End date today (inclusive)
          AND annotator_id = 'KvgYw3yiXshBeiViHJzXhyZIjyO2'
        GROUP BY TO_CHAR(DATE_TRUNC('day', to_timestamp(timestamp)), 'yyyy-MM-dd'))
        SELECT TO_CHAR(all_days.date, 'yyyy-MM-dd') AS date,
       TO_CHAR(all_days.date, 'Day')                   AS day_of_week,
       COALESCE(annotation_counts.annotation_count, 0) AS annotation_count
        FROM all_days
            LEFT JOIN annotation_counts
        ON all_days.date = annotation_counts.date
        ORDER BY all_days.date;

    `
}
