INSERT INTO
    shipping_methods (
        name,
        code,
        price,
        delivery_days,
        description,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        'Aras Kargo',
        'aras',
        30.00,
        '2-3 iş günü',
        'Aras Kargo ile hızlı teslimat',
        true,
        NOW(),
        NOW()
    ),
    (
        'Yurtiçi Kargo',
        'yurtici',
        35.00,
        '2-4 iş günü',
        'Yurtiçi Kargo ile güvenli teslimat',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (code) DO
UPDATE
SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    delivery_days = EXCLUDED.delivery_days,
    description = EXCLUDED.description,
    updated_at = NOW();