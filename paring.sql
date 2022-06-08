with click_event as (
            SELECT "u1" user_id, "i1" item_id, "c1" adv_company, 100 ts
  UNION ALL SELECT "u1" user_id, "i2" item_id, "c1" adv_company, 105 ts
  UNION ALL SELECT "u1" user_id, "i1" item_id, "c1" adv_company, 106 ts
  UNION ALL SELECT "u2" user_id, "i3" item_id, "c2" adv_company, 106 ts
  UNION ALL SELECT "u2" user_id, "i3" item_id, "c4" adv_company, 109 ts
),
puchase AS (
            SELECT "u1" user_id, "i1" item_id, 101 ts
  UNION ALL SELECT "u2" user_id, "i3" item_id, 105 ts
  UNION ALL SELECT "u2" user_id, "i3" item_id, 107 ts
  UNION ALL SELECT "u2" user_id, "i3" item_id, 110 ts

), 
normalized AS (
SELECT
    user_id
  , item_id
  , adv_company
--  , LAG(ts, 1 , -1) OVER (PARTITION BY user_id, item_id ORDER BY ts) as prev_click_time 
  , ts as click_time
  , LEAD(ts, 1 , 100000) OVER (PARTITION BY user_id, item_id ORDER BY ts) as next_click_time 
FROM
  click_event
)
SELECT
    a.user_id
  , a.item_id
  , a.adv_company
  , ts as purchase_time
FROM normalized a
JOIN puchase b ON (a.user_id = b.user_id AND a.item_id=b.item_id) 
WHERE 
        a.click_time <= b.ts 
  AND   a.next_click_time > b.ts
