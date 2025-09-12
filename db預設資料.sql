-- ROLLBACK;

USE pinpinsql;

SET autocommit = 0;

START TRANSACTION;

INSERT INTO icon_type(name)
VALUES
  ('fontawesome'),
  ('iconify');


INSERT INTO language (english_name, local_name, create_at)
VALUES
  ('English', 'English', NOW()),
  ('Chinese', '中文', NOW()),
  ('French', 'Français', NOW()),
  ('German', 'Deutsch', NOW()),
  ('Japanese', '日本語', NOW()),
  ('Korean', '한국어', NOW()),
  ('Spanish', 'Español', NOW()),
  ('Russian', 'Русский', NOW()),
  ('Arabic', 'العربية', NOW());

INSERT INTO currency (code, icon, icon_type_id, create_at)
VALUES 
  ('USD', 'fas fa-dollar-sign',1, NOW()),
  ('EUR', 'fas fa-euro-sign',1, NOW()),
  ('JPY', 'fas fa-yen-sign',1, NOW()),
  ('GBP', 'fas fa-pound-sign',1, NOW()),
  ('AUD', 'fas fa-dollar-sign',1, NOW()),
  ('CAD', 'fas fa-dollar-sign',1, NOW()),
  ('CHF', 'fas fa-franc-sign',1, NOW()),
  ('CNY', 'fas fa-yen-sign',1, NOW()),
  ('NZD', 'fas fa-dollar-sign',1, NOW()),
  ('TWD', 'fas fa-dollar-sign',1, NOW());

INSERT INTO country (code, dial_code, english_name, local_name, icon, icon_type_id, create_at)
VALUES 
  ('TW', 886, 'Taiwan', '台灣', 'flagTW',2, NOW()),
  ('US', 1, 'United States', 'United States', 'flagUS',2, NOW()),
  ('GB', 44, 'United Kingdom', 'United Kingdom', 'flagGB',2, NOW()),
  ('CA', 1, 'Canada', 'Canada', 'flagCA',2, NOW()),
  ('AU', 61, 'Australia', 'Australia', 'flagAU',2, NOW()),
  ('JP', 81, 'Japan', '日本', 'flagJP',2, NOW()),
  ('CN', 86, 'China', '中国', 'flagCN',2, NOW()),
  ('DE', 49, 'Germany', 'Deutschland', 'flagDE',2, NOW()),
  ('FR', 33, 'France', 'France', 'flagFR',2, NOW()),
  ('IN', 91, 'India', 'भारत', 'flagIN',2, NOW());

-- 建立 Country 與 Language 的關聯
-- 台灣 (TW, id=1) 以中文與英文
INSERT INTO country_language_language (country_id, language_id) VALUES (1, 1), (1, 2);

-- 美國 (US, id=2) 以英文
INSERT INTO country_language_language (country_id, language_id) VALUES (2, 1);

-- 英國 (GB, id=3) 以英文
INSERT INTO country_language_language (country_id, language_id) VALUES (3, 1);

-- 加拿大 (CA, id=4) 有英文與法文
INSERT INTO country_language_language (country_id, language_id) VALUES (4, 1), (4, 3);

-- 澳洲 (AU, id=5) 以英文
INSERT INTO country_language_language (country_id, language_id) VALUES (5, 1);

-- 日本 (JP, id=6) 以日文
INSERT INTO country_language_language (country_id, language_id) VALUES (6, 5);

-- 中國 (CN, id=7) 以中文
INSERT INTO country_language_language (country_id, language_id) VALUES (7, 2);

-- 德國 (DE, id=8) 以德文
INSERT INTO country_language_language (country_id, language_id) VALUES (8, 4);

-- 法國 (FR, id=9) 以法文
INSERT INTO country_language_language (country_id, language_id) VALUES (9, 3);

-- 印度 (IN, id=10) 以英文 (僅作示範，實際上印度有多種語言)
INSERT INTO country_language_language (country_id, language_id) VALUES (10, 1);

-- 建立 Country 與 Currency 的關聯
-- 台灣 (TW, id=1) 使用新台幣 (TWD, id=10)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (1, 10);

-- 美國 (US, id=2) 使用美元 (USD, id=1)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (2, 1);

-- 英國 (GB, id=3) 使用英鎊 (GBP, id=4)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (3, 4);

-- 加拿大 (CA, id=4) 使用加幣 (CAD, id=6)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (4, 6);

-- 澳洲 (AU, id=5) 使用澳幣 (AUD, id=5)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (5, 5);

-- 日本 (JP, id=6) 使用日圓 (JPY, id=3)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (6, 3);

-- 中國 (CN, id=7) 使用人民幣 (CNY, id=8)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (7, 8);

-- 德國 (DE, id=8) 使用歐元 (EUR, id=2)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (8, 2);

-- 法國 (FR, id=9) 使用歐元 (EUR, id=2)
INSERT INTO country_currency_currency (country_id, currency_id) VALUES (9, 2);

INSERT INTO travel_interest_type (name, color, create_at)
VALUES
  ('文化探索', 'indigo', NOW()),
  ('自然風光', 'green', NOW()),
  ('美食之旅', 'deep-orange', NOW()),
  ('冒險體驗', 'red', NOW()),
  ('歷史古蹟', 'blue-grey', NOW()),
  ('休閒度假', 'blue', NOW()),
  ('藝術巡禮', 'purple', NOW()),
  ('購物旅遊', 'pink', NOW());

INSERT INTO travel_interest (name, icon,icon_type_id, travel_interest_type_id, create_at)
VALUES
  -- 文化探索類別 (travel_interest_type_id = 1)
  ('古蹟巡禮', 'fa-landmark', 1, 1, NOW()),
  ('博物館參觀', 'fa-university', 1, 1, NOW()),
  ('傳統表演', 'fa-theater-masks', 1, 1, NOW()),
  ('歷史古城', 'fa-city', 1, 1, NOW()),
  ('文化節慶', 'fa-calendar-alt', 1, 1, NOW()),
  
  -- 自然風光類別 (travel_interest_type_id = 2)
  ('山脈健行', 'fa-mountain', 1, 2, NOW()),
  ('海邊漫步', 'fa-umbrella-beach', 1, 2, NOW()),
  ('湖畔休憩', 'fa-water', 1, 2, NOW()),
  ('森林探險', 'fa-tree', 1, 2, NOW()),
  ('草原野餐', 'fa-campground', 1, 2, NOW()),

  -- 美食之旅類別 (travel_interest_type_id = 3)
  ('街邊小吃', 'fa-utensils', 1, 3, NOW()),
  ('米其林美食', 'fa-star', 1, 3, NOW()),
  ('異國料理', 'fa-globe', 1, 3, NOW()),
  ('烘焙甜點', 'fa-ice-cream', 1, 3, NOW()),
  ('美酒品嚐', 'fa-wine-glass-alt', 1, 3, NOW()),
  
  -- 冒險體驗類別 (travel_interest_type_id = 4)
  ('高空彈跳', 'fa-parachute-box', 1, 4, NOW()),
  ('激流泛舟', 'fa-water', 1, 4, NOW()),
  ('攀岩體驗', 'climbing', 2, 4, NOW()),
  ('越野車探險', 'fa-car', 1, 4, NOW()),
  ('熱氣球飛行', 'airballoon', 2, 4, NOW()),
  
    -- 歷史古蹟類別 (travel_interest_type_id = 5)
  ('古蹟參訪', 'fa-landmark', 1, 5, NOW()),
  ('遺址探訪', 'fa-monument', 1, 5, NOW()),
  ('城牆漫步', 'fa-archway', 1, 5, NOW()),
  ('文物展覽', 'fa-scroll', 1, 5, NOW()),
  ('歷史重現', 'fa-history', 1, 5, NOW()),
  
  -- 休閒度假類別 (travel_interest_type_id = 6)
  ('渡假村休憩', 'fa-hotel', 1, 6, NOW()),
  ('SPA放鬆', 'fa-spa', 1, 6, NOW()),
  ('溫泉療癒', 'fa-hot-tub', 1, 6, NOW()),
  ('休閒咖啡', 'fa-coffee', 1, 6, NOW()),
  ('陽光休憩', 'fa-sun', 1, 6, NOW()),

  -- 藝術巡禮類別 (travel_interest_type_id = 7)
  ('美術館參觀', 'fa-palette', 1, 7, NOW()),
  ('雕塑展覽', 'fa-image', 1, 7, NOW()),
  ('街頭藝術', 'fa-spray-can', 1, 7, NOW()),
  ('劇場表演', 'fa-theater-masks', 1, 7, NOW()),
  ('音樂會巡禮', 'fa-music', 1, 7, NOW()),
  
  -- 購物旅遊類別 (travel_interest_type_id = 8)
  ('傳統市場逛街', 'fa-store', 1, 8, NOW()),
  ('名牌購物', 'fa-shopping-bag', 1, 8, NOW()),
  ('手作市集', 'fa-shopping-basket', 1, 8, NOW()),
  ('百貨公司體驗', 'fa-building', 1, 8, NOW()),
  ('特色小店探訪', 'fa-tag', 1, 8, NOW()),

-- 跟類別名稱對應的資料
  ('文化探索', 'fa-landmark', 1, 1, NOW()),
  ('自然風光', 'fa-mountain', 1, 2, NOW()),
  ('美食之旅', 'fa-utensils', 1, 3, NOW()),
  ('冒險體驗', 'fa-parachute-box', 1, 4, NOW()),
  ('歷史古蹟', 'fa-monument', 1, 5, NOW()),
  ('休閒度假', 'fa-hotel', 1, 6, NOW()),
  ('藝術巡禮', 'fa-palette', 1, 7, NOW()),
  ('購物旅遊', 'fa-store', 1, 8, NOW());

INSERT INTO travel_style (name, description, icon, icon_type_id, color)
VALUES 
  ('奢華', '高端、奢華的旅行體驗，享受頂級服務', 'fa-gem', 1, 'amber'),
  ('經濟', '著重成本效益，選擇實惠的旅行方案', 'fa-wallet', 1, 'green darken-2'),
  ('背包客', '自由靈活的冒險旅行，強調探索與自助', 'fa-hiking', 1, 'brown'),
  ('家庭旅遊', '適合全家出遊，提供親子友善的活動與住宿', 'fa-users', 1, 'blue'),
  ('單人旅行', '獨自探索，享受個人自由與獨立', 'fa-user', 1, 'orange'),
  ('團體旅行', '組織性強的團體出遊，共享行程和體驗', 'fa-people-group', 1, 'purple'),
  ('自助規劃', '根據個人興趣自訂行程，強調自主規劃', 'fa-map-marker-alt', 1, 'teal'),
  ('隨性旅行', '隨意即興，沒有固定計劃，享受變化與驚喜', 'fa-random', 1, 'pink');

INSERT INTO avatar (public_id, type)
VALUES
  ('xqmtjf1uinu2w8cszqf0',1),
  ('r7bctuoecpfoa2su1qdj',1),
  ('ynnewwosoyeuifgewxdn',1),
  ('kwvabhibrl3kxnd3x2bi',1),
  ('tkzdxrmivhu8qcdkdehq',1),
  ('nlpxaf0o1lobfckx6urd',1),
  ('nn3vyvi0jbjncigmnh2v',1),
  ('tq40szgvzplp161wsrq3',1),
  ('wmtnqix8twhbotqnkqsr',1),
  ('h57jhbywhg4t7x1db9nc',1),
  ('ocz6bvwqosogfvcnjudn',1),
  ('ijp67ji1xqbnofd1eyfc',1),
  ('tbkqwawx1zqtwsqxg3nr',1),
  ('urxtsq64fvdmmt8zb9hn',1),
  ('tclmrb1onwhhlpxztujf',1),
  ('zghnlbl2j4znd24j5vud',1),
  ('yppqzczwggytwncdekyn',1),
  ('msk1rbisuvlzcu8wsr3b',1);

COMMIT;