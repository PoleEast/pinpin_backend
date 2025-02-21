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

INSERT INTO Currency (code, icon, create_at)
VALUES 
  ('USD', 'fas fa-dollar-sign', NOW()),
  ('EUR', 'fas fa-euro-sign', NOW()),
  ('JPY', 'fas fa-yen-sign', NOW()),
  ('GBP', 'fas fa-pound-sign', NOW()),
  ('AUD', 'fas fa-dollar-sign', NOW()),
  ('CAD', 'fas fa-dollar-sign', NOW()),
  ('CHF', 'fas fa-franc-sign', NOW()),
  ('CNY', 'fas fa-yen-sign', NOW()),
  ('NZD', 'fas fa-dollar-sign', NOW()),
  ('TWD', 'fas fa-dollar-sign', NOW());

INSERT INTO Country (code, dial_code, english_name, local_name, icon, create_at)
VALUES 
  ('TW', 886, 'Taiwan', '台灣', 'flag-icon-tw', NOW()),
  ('US', 1, 'United States', 'United States', 'flag-icon-us', NOW()),
  ('GB', 44, 'United Kingdom', 'United Kingdom', 'flag-icon-gb', NOW()),
  ('CA', 1, 'Canada', 'Canada', 'flag-icon-ca', NOW()),
  ('AU', 61, 'Australia', 'Australia', 'flag-icon-au', NOW()),
  ('JP', 81, 'Japan', '日本', 'flag-icon-jp', NOW()),
  ('CN', 86, 'China', '中国', 'flag-icon-cn', NOW()),
  ('DE', 49, 'Germany', 'Deutschland', 'flag-icon-de', NOW()),
  ('FR', 33, 'France', 'France', 'flag-icon-fr', NOW()),
  ('IN', 91, 'India', 'भारत', 'flag-icon-in', NOW());

-- 建立 Country 與 Language 的關聯
-- 台灣 (TW, id=1) 以中文與英文
INSERT INTO country_language (countryId, languageId) VALUES (1, 1), (1, 2);

-- 美國 (US, id=2) 以英文
INSERT INTO country_language (countryId, languageId) VALUES (2, 1);

-- 英國 (GB, id=3) 以英文
INSERT INTO country_language (countryId, languageId) VALUES (3, 1);

-- 加拿大 (CA, id=4) 有英文與法文
INSERT INTO country_language (countryId, languageId) VALUES (4, 1), (4, 3);

-- 澳洲 (AU, id=5) 以英文
INSERT INTO country_language (countryId, languageId) VALUES (5, 1);

-- 日本 (JP, id=6) 以日文
INSERT INTO country_language (countryId, languageId) VALUES (6, 5);

-- 中國 (CN, id=7) 以中文
INSERT INTO country_language (countryId, languageId) VALUES (7, 2);

-- 德國 (DE, id=8) 以德文
INSERT INTO country_language (countryId, languageId) VALUES (8, 4);

-- 法國 (FR, id=9) 以法文
INSERT INTO country_language (countryId, languageId) VALUES (9, 3);

-- 印度 (IN, id=10) 以英文 (僅作示範，實際上印度有多種語言)
INSERT INTO country_language (countryId, languageId) VALUES (10, 1);

-- 建立 Country 與 Currency 的關聯
-- 台灣 (TW, id=1) 使用新台幣 (TWD, id=10)
INSERT INTO country_currency (countryId, currencyId) VALUES (1, 10);

-- 美國 (US, id=2) 使用美元 (USD, id=1)
INSERT INTO country_currency (countryId, currencyId) VALUES (2, 1);

-- 英國 (GB, id=3) 使用英鎊 (GBP, id=4)
INSERT INTO country_currency (countryId, currencyId) VALUES (3, 4);

-- 加拿大 (CA, id=4) 使用加幣 (CAD, id=6)
INSERT INTO country_currency (countryId, currencyId) VALUES (4, 6);

-- 澳洲 (AU, id=5) 使用澳幣 (AUD, id=5)
INSERT INTO country_currency (countryId, currencyId) VALUES (5, 5);

-- 日本 (JP, id=6) 使用日圓 (JPY, id=3)
INSERT INTO country_currency (countryId, currencyId) VALUES (6, 3);

-- 中國 (CN, id=7) 使用人民幣 (CNY, id=8)
INSERT INTO country_currency (countryId, currencyId) VALUES (7, 8);

-- 德國 (DE, id=8) 使用歐元 (EUR, id=2)
INSERT INTO country_currency (countryId, currencyId) VALUES (8, 2);

-- 法國 (FR, id=9) 使用歐元 (EUR, id=2)
INSERT INTO country_currency (countryId, currencyId) VALUES (9, 2);

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

INSERT INTO travel_interest (name, icon, travel_interest_type, create_at)
VALUES
  -- 文化探索類別 (travel_interest_type = 1)
  ('古蹟巡禮', 'fa-landmark', 1, NOW()),
  ('博物館參觀', 'fa-university', 1, NOW()),
  ('傳統表演', 'fa-theater-masks', 1, NOW()),
  ('歷史古城', 'fa-city', 1, NOW()),
  ('文化節慶', 'fa-calendar-alt', 1, NOW()),
  
  -- 自然風光類別 (travel_interest_type = 2)
  ('山脈健行', 'fa-mountain', 2, NOW()),
  ('海邊漫步', 'fa-umbrella-beach', 2, NOW()),
  ('湖畔休憩', 'fa-water', 2, NOW()),
  ('森林探險', 'fa-tree', 2, NOW()),
  ('草原野餐', 'fa-campground', 2, NOW()),

  -- 美食之旅類別 (travel_interest_type = 3)
  ('街邊小吃', 'fa-utensils', 3, NOW()),
  ('米其林美食', 'fa-star', 3, NOW()),
  ('異國料理', 'fa-globe', 3, NOW()),
  ('烘焙甜點', 'fa-ice-cream', 3, NOW()),
  ('美酒品嚐', 'fa-wine-glass-alt', 3, NOW()),
  
  -- 冒險體驗類別 (travel_interest_type = 4)
  ('高空彈跳', 'fa-parachute-box', 4, NOW()),
  ('激流泛舟', 'fa-water', 4, NOW()),
  ('攀岩體驗', 'fa-person-climbing', 4, NOW()),
  ('越野車探險', 'fa-car', 4, NOW()),
  ('熱氣球飛行', 'fa-hotairballoon', 4, NOW()),
  
    -- 歷史古蹟類別 (travel_interest_type = 5)
  ('古蹟參訪', 'fa-landmark', 5, NOW()),
  ('遺址探訪', 'fa-monument', 5, NOW()),
  ('城牆漫步', 'fa-archway', 5, NOW()),
  ('文物展覽', 'fa-scroll', 5, NOW()),
  ('歷史重現', 'fa-history', 5, NOW()),
  
  -- 休閒度假類別 (travel_interest_type = 6)
  ('渡假村休憩', 'fa-hotel', 6, NOW()),
  ('SPA放鬆', 'fa-spa', 6, NOW()),
  ('溫泉療癒', 'fa-hot-tub', 6, NOW()),
  ('休閒咖啡', 'fa-coffee', 6, NOW()),
  ('陽光休憩', 'fa-sun', 6, NOW()),

  -- 藝術巡禮類別 (travel_interest_type = 7)
  ('美術館參觀', 'fa-palette', 7, NOW()),
  ('雕塑展覽', 'fa-image', 7, NOW()),
  ('街頭藝術', 'fa-spray-can', 7, NOW()),
  ('劇場表演', 'fa-theater-masks', 7, NOW()),
  ('音樂會巡禮', 'fa-music', 7, NOW()),
  
  -- 購物旅遊類別 (travel_interest_type = 8)
  ('傳統市場逛街', 'fa-store', 8, NOW()),
  ('名牌購物', 'fa-shopping-bag', 8, NOW()),
  ('手作市集', 'fa-shopping-basket', 8, NOW()),
  ('百貨公司體驗', 'fa-building', 8, NOW()),
  ('特色小店探訪', 'fa-tag', 8, NOW()),

-- 跟類別名稱對應的資料
  ('文化探索', 'fa-landmark', 1, NOW()),
  ('自然風光', 'fa-mountain', 2, NOW()),
  ('美食之旅', 'fa-utensils', 3, NOW()),
  ('冒險體驗', 'fa-parachute-box', 4, NOW()),
  ('歷史古蹟', 'fa-monument', 5, NOW()),
  ('休閒度假', 'fa-hotel', 6, NOW()),
  ('藝術巡禮', 'fa-palette', 7, NOW()),
  ('購物旅遊', 'fa-store', 8, NOW());