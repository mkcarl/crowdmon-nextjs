import sql from '@/lib/postgres'
import dayjs from 'dayjs'

export const getContributionByType = async (annotator_id: string) => {
    return sql`
        select 'bounding box' as name, count(*) as value
        from annotation
            left join crop c
        on annotation.annotation_id = c.annotation_id
        where annotator_id = ${annotator_id};
    `
}

export const getContributionsByDay = async (annotator_id: string) => {
    return sql`
        WITH dates as (SELECT (current_timestamp AT TIME ZONE 'Asia/Kuala_Lumpur' - INTERVAL '13 days')::date +
                      generate_series(0, 13) as time)
        SELECT to_char(dates.time, 'Day') as day_of_week, coalesce(observation.num, 0) as annotation_count
        FROM dates
                 LEFT JOIN (SELECT to_char(time, 'YYYY-MM-DD') as time, count(*) as num
                            FROM (SELECT to_timestamp(timestamp) AT TIME ZONE 'Asia/Kuala_Lumpur' as time, *
                                FROM annotation
                                WHERE annotator_id = ${annotator_id}) as t
                            GROUP BY to_char(time, 'YYYY-MM-DD')) as observation
                           ON to_char(dates.time, 'YYYY-MM-DD') = observation.time
        ORDER BY dates.time;
    `
}

export const getContributionGroupedByVideoId = async (annotator_id: string) => {
    return sql`
        SELECT i.video_name                                                 as video_id,
               SUM(CASE WHEN c.annotation_id IS NOT NULL THEN 1 ELSE 0 END) as num_crops,
               SUM(CASE WHEN c.annotation_id IS NULL THEN 1 ELSE 0 END)     as num_no_crops
        FROM annotation a
                 LEFT JOIN
             crop c on a.annotation_id = c.annotation_id
                 JOIN
             image i on a.image_id = i.image_id
        WHERE annotator_id = ${annotator_id}
        GROUP BY i.video_name;
    `
}

export const getNumberOfDaysLoggedIn = async (annotator_id: string) => {
    type Data = { num_logged_in_days: number }
    const res = await sql<Data[]>`
        SELECT COUNT(DISTINCT TO_CHAR(DATE_TRUNC('day', TIMEZONE('Asia/Kuala_Lumpur', to_timestamp(timestamp))), 'yyyy-MM-dd')) AS num_logged_in_days
        FROM annotation
                 JOIN crop c on annotation.annotation_id = c.annotation_id
        WHERE annotator_id = ${annotator_id};
    `
    return res.pop()?.num_logged_in_days
}

export const getTotalAnnotations = async (annotator_id: string) => {
    type Data = {
        total_annotations: number
    }
    const res = await sql<Data[]>`
        SELECT COUNT(*) AS total_annotations
        FROM annotation
        WHERE annotator_id = ${annotator_id};
    `
    return res.pop()?.total_annotations
}

export const getContributionRankAndPercentage = async (
    annotator_id: string
) => {
    type Data = {
        annotator_id: string
        num_annotations: number
        rank: number
        percentage: number
    }
    const res = await sql<Data[]>`
        SELECT annotator_id, COUNT(*) AS num_annotations,
               RANK() OVER (ORDER BY COUNT(*) DESC) AS rank,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM annotation), 2) AS percentage
        FROM annotation
        WHERE annotator_id = ${annotator_id}
        GROUP BY annotator_id
        ORDER BY num_annotations DESC;
`
    return res.pop()
}
