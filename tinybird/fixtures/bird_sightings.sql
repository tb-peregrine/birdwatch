SELECT
    now() - toIntervalSecond(rand() % (30 * 24 * 60 * 60)) AS timestamp,
    ['American Robin', 'Northern Cardinal', 'Blue Jay', 'Mourning Dove', 'House Sparrow', 'European Starling', 'American Crow', 'Black-capped Chickadee', 'Downy Woodpecker', 'House Finch'][(rand() % 10) + 1] AS species,
    ['shelby_park_mission_hill', 'shelby_bottoms_greenway_phase_3', 'shelby_bottoms_greenway_cornelia_fort_airpark', 'shelby_park_sevier_lake'][(rand() % 4) + 1] AS location,
    1 + (rand() % 10) AS quantity,
    concat('CL', toString(100000 + rand() % 900000)) AS checklist_id,
    concat('user_', toString(1000 + rand() % 9000)) AS user_id
FROM numbers(10000)