-- church_history_eras: era groups
create table if not exists church_history_eras (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  period text not null,
  icon_name text not null,
  sort_order int not null
);

-- church_history_events: individual events
create table if not exists church_history_events (
  id uuid default gen_random_uuid() primary key,
  era_id uuid references church_history_eras(id) on delete cascade not null,
  year text not null,
  date text not null,
  event_text text not null,
  is_major boolean default false,
  sort_order int not null
);

-- RLS
alter table church_history_eras enable row level security;
alter table church_history_events enable row level security;

create policy "Public read eras" on church_history_eras for select using (true);
create policy "Public read events" on church_history_events for select using (true);

-- ============================================================
-- Seed data
-- ============================================================

DO $$
DECLARE
  era1 uuid;
  era2 uuid;
  era3 uuid;
  era4 uuid;
BEGIN

-- Eras
INSERT INTO church_history_eras (title, period, icon_name, sort_order) VALUES ('새로운 도약', '2024 - 2026', 'Star', 0) RETURNING id INTO era1;
INSERT INTO church_history_eras (title, period, icon_name, sort_order) VALUES ('성령의 역사', '2015 - 2023', 'ShieldCheck', 1) RETURNING id INTO era2;
INSERT INTO church_history_eras (title, period, icon_name, sort_order) VALUES ('믿음의 계승', '1995 - 2014', 'Users', 2) RETURNING id INTO era3;
INSERT INTO church_history_eras (title, period, icon_name, sort_order) VALUES ('창립과 개척', '1977 - 1989', 'History', 3) RETURNING id INTO era4;

-- ============================================================
-- Era 1: 새로운 도약 (2024 - 2026)
-- ============================================================

-- 2026
INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era1, '2026', '01.05', '신년축복 열두광주리 특별새벽기도회 (여의도순복음교회 연합)', true,  0),
  (era1, '2026', '01.03', '신년축복 온가족 특별새벽기도회', false, 1);

-- 2025
INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era1, '2025', '12.31', '송구영신예배 및 윷놀이 대회', false, 0),
  (era1, '2025', '12.25', '2025 캔사스 성탄절 연합예배 참석 (구호성 목사 설교, 권세열 목사 봉헌기도)', false, 1),
  (era1, '2025', '12.21', '2025년 캔사스순복음교회 남선교회, 여선교회 총회', false, 2),
  (era1, '2025', '12.13', 'William Curtis Cady 성도 천국환송예배', false, 3),
  (era1, '2025', '12.07', '교회창립 48주년 제직임명감사예배 (명예장로 6명, 안수집사 1명, 권사 5명)', true, 4),
  (era1, '2025', '12.06', '12월 온가족 특별새벽기도회', false, 5),
  (era1, '2025', '11.23', '2025 추수감사나눔공모전', false, 6),
  (era1, '2025', '11.03', '2025 추수감사 21일 특별새벽기도회(여의도순복음 연합)', true, 7),
  (era1, '2025', '11.02', '조은영 전도사 사역종료', false, 8),
  (era1, '2025', '11.01', '11월 온가족 특별새벽기도회', false, 9),
  (era1, '2025', '10.31', 'Holy Win Day 행사', false, 10),
  (era1, '2025', '10.20', '담임목사 북미총회 중중부지방회 모임 참석 (오마하)', false, 11),
  (era1, '2025', '10.19', '장은경 전도사 해임', false, 12),
  (era1, '2025', '10.17', '특별 금요예배 (강사: 김문수 목사)', false, 13),
  (era1, '2025', '10.12', '제직임명 인준을 위한 공동의회', false, 14),
  (era1, '2025', '10.04', '10월 온가족 특별새벽기도회', false, 15),
  (era1, '2025', '09.28', '제직임명대상자 추천 및 지원 시작', false, 16),
  (era1, '2025', '09.14', '조한민 목사 해임', false, 17),
  (era1, '2025', '09.12', '특별 금요예배 (강사: 윤사무엘 전도사)', false, 18),
  (era1, '2025', '09.06', '9월 온가족 특별새벽기도회', false, 19),
  (era1, '2025', '08.24', '2025년도 캔사스순복음교회 침례식 (6명)', true, 20),
  (era1, '2025', '08.22', '특별 금요예배 (강사: 최재은 선교사)', false, 21),
  (era1, '2025', '08.17', '조문수 권사님 90세 생신잔치', false, 22),
  (era1, '2025', '08.11', '친교실 주방 페인트 작업', false, 23),
  (era1, '2025', '08.04', '성전바닥 카페트 클리닝 작업', false, 24),
  (era1, '2025', '08.02', '8월 온가족 특별새벽기도회', false, 25),
  (era1, '2025', '07.15', '2025 교회학교 VBS (Keepers of the Kingdom)', true, 26),
  (era1, '2025', '07.08', 'VBS 및 다음세대를 위한 특별새벽기도회', false, 27),
  (era1, '2025', '07.05', '7월 온가족 특별새벽기도회', false, 28),
  (era1, '2025', '06.28', '브랜슨 DAVID 단체관람 (43명 참석)', false, 29),
  (era1, '2025', '06.07', '6월 온가족 특별새벽기도회', false, 30),
  (era1, '2025', '05.26', '제1회 캔사스 최고의 도시어부를 찾아라! (낚시공동체)', false, 31),
  (era1, '2025', '05.18', '김메케나 성도 Baby Shower', false, 32),
  (era1, '2025', '05.17', '2025 여선교회 춘계 선교바자회', false, 33),
  (era1, '2025', '05.16', '특별 금요예배 (강사: 사라킴 대표)', false, 34),
  (era1, '2025', '05.03', '교회학교 봄소풍 및 5월 온가족 특새', false, 35),
  (era1, '2025', '04.25', '알러지 무료 침술 (안경환 원장)', false, 36),
  (era1, '2025', '04.20', '2025 캔사스 부활절 연합예배 및 본교회 예배', true, 37),
  (era1, '2025', '04.13', '2025년도 1/4분기 제직회', false, 38),
  (era1, '2025', '04.11', '특별 금요예배 (강사: 연모세 선교사)', false, 39),
  (era1, '2025', '04.05', '4월 온가족 특별새벽기도회', false, 40),
  (era1, '2025', '03.26', '친교실 머그컵 거치대 설치 및 교육관 정비', false, 41),
  (era1, '2025', '03.24', '제50차 북미총회 정기총회 (LA, 담임목사 참석)', false, 42),
  (era1, '2025', '03.16', '친교실 머그컵 사용 캠페인 시작', false, 43),
  (era1, '2025', '03.02', '2025 여선교회 정기 헌신예배', false, 44),
  (era1, '2025', '03.01', '2025 춘계대심방 시작', true, 45),
  (era1, '2025', '02.09', '2025 제직교육 시작', false, 46),
  (era1, '2025', '02.01', '캔사스 한인회 신년하례회 본교회 개최', false, 47),
  (era1, '2025', '01.26', '2024년 결산 및 2025년 예산 공동의회', false, 48),
  (era1, '2025', '01.17', '유튜브 온라인 실시간 방송 시작', false, 49),
  (era1, '2025', '01.02', '2025 신년축복 열두광주리 특별새벽기도회', false, 50),
  (era1, '2025', '01.01', '신년축복예배 및 통역기 구입(15EA)', false, 51);

-- 2024
INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era1, '2024', '12.31', '2025 송구영신예배 및 연말효도잔치', true, 0),
  (era1, '2024', '12.29', '2025년도 교역자, 봉사부서 및 기관 담당 임명', false, 1),
  (era1, '2024', '12.25', '2024 성탄축하예배', false, 2),
  (era1, '2024', '12.15', '남선교회 총회', false, 3),
  (era1, '2024', '12.01', '크리스마스 트리 설치', false, 4),
  (era1, '2024', '11.24', '2024 추수감사주일 행사', false, 5),
  (era1, '2024', '11.17', '여선교회 헌신예배 및 총회', false, 6),
  (era1, '2024', '11.10', '2024 Veteran''s Day 감사행사', false, 7),
  (era1, '2024', '11.03', '추수감사 다니엘 특별새벽기도회', true, 8),
  (era1, '2024', '10.05', '2024 가을맞이 바자회', false, 9),
  (era1, '2024', '09.15', '2024 가을맞이 온가족 초청 야외예배 (샤니미션파크)', true, 10),
  (era1, '2024', '07.22', '교육관 수리 및 환경작업(페인트)', false, 11),
  (era1, '2024', '07.14', '2024 교회학교 하계 수련회 (캔터키 노아의 방주)', true, 12),
  (era1, '2024', '06.30', '장은경 전도사 부임', false, 13),
  (era1, '2024', '05.05', '권세열 담임목사 공식 취임', true, 14),
  (era1, '2024', '01.23', '창립 47주년 및 권세열 목사 사역 시작', true, 15),
  (era1, '2024', '01.21', '김경민 목사 사역종료 및 타코마(워싱턴주)로 임지 이동', false, 16),
  (era1, '2024', '01.09', '권세열 목사 캔사스 도착', false, 17);

-- ============================================================
-- Era 2: 성령의 역사 (2015 - 2023)
-- ============================================================

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2023', '11.12', '조한민 목사 부임 (교회학교)', false, 0),
  (era2, '2023', '04.14', '두란노 아버지 학교 캔사스 2기 진행', true, 1),
  (era2, '2023', '04.09', '침례식 및 헌아식 (총 6명)', false, 2);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2022', '12.04', '조은영 전도사 부임', false, 0),
  (era2, '2022', '10.16', '전교인 야외 예배 (Shawnee Mission Park)', false, 1),
  (era2, '2022', '05.01', '이형주 목사 부임', false, 2),
  (era2, '2022', '04.22', '창립 45주년 기념 부흥회 (윤호용 목사)', true, 3);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2021', '10.31', '추수감사 21일 다니엘 기도회', false, 0),
  (era2, '2021', '06.20', '전교인 야외 예배', false, 1),
  (era2, '2021', '05.29', '성전 이전을 위한 바자회', true, 2);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2020', '11.22', '추수감사절 예배 및 집사 임명 (이병우, 이소피아)', true, 0),
  (era2, '2020', '07.13', '성전 이전 및 영적 회복을 위한 40일 기도회', false, 1),
  (era2, '2020', '03.22', '코로나19로 인한 온라인 예배 전환', true, 2);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2019', '11.17', '새신자 침례 (이병우, 이소피아, 김예린)', false, 0),
  (era2, '2019', '08.31', '전교인 수련회 (Heartland Retreat Center)', false, 1),
  (era2, '2019', '02.17', '캔사스한글사랑한글학교 봄학기 개강', false, 2),
  (era2, '2019', '01.06', '한순황 전도사 부임', false, 3);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2018', '09.28', '캔사스 지역 연합 부흥회 (강사: 진유철 목사)', false, 0),
  (era2, '2018', '07.23', '멕시코 단기 선교 파송', true, 1),
  (era2, '2018', '01.01', '2018 신년 특별 새벽 예배', false, 2);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2017', '10.01', '임직식 (명예장로 김남윤, 안수집사 김창룡 등)', true, 0),
  (era2, '2017', '01.23', '교회 창립 40주년 기념', false, 1);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era2, '2015', '07.26', '제15대 김경민 담임목사 취임 및 공영식 목사 은퇴', true, 0);

-- ============================================================
-- Era 3: 믿음의 계승 (1995 - 2014)
-- ============================================================

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '2002', '01.20', '안수집사 류상선 임직', true, 0);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '2001', '12.02', '여전도회와 권사회 분리 및 조직 정비', false, 0);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '2000', '02.20', '캔사스순복음교회와 샘물순복음교회 통합 (박 엘리사 목사 취임)', true, 0),
  (era3, '2000', '02.20', '조문수, 김금남, 최광자 권사 취임', false, 1);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '1999', '03.07', '안수집사 이요한 임직', false, 0);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '1996', '12.01', '박한득 권사 본 교회 시무 시작', false, 0);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era3, '1995', '11.08', '임직식 (안수집사 허생기, 권사 박진양, 최의기)', false, 0);

-- ============================================================
-- Era 4: 창립과 개척 (1977 - 1989)
-- ============================================================

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era4, '1989', '10.29', '현재 성전(1424 S 55th St) 매입 및 입당예배', true, 0),
  (era4, '1989', '10.01', '건물 및 사택, 대지 3에이커 매입 ($120,000)', true, 1);

INSERT INTO church_history_events (era_id, year, date, event_text, is_major, sort_order) VALUES
  (era4, '1977', '04.01', '최자실 목사 인도하에 제직회 구성 (서일로 외 7명 임명)', true, 0),
  (era4, '1977', '01.23', '박규봉 목사 외 5명으로 캔사스순복음교회 창립예배', true, 1),
  (era4, '1977', '개척사', '성전 매입 전까지 12년 동안 8곳의 예배처소(Lexea 순복음, Leaven Worth 등)를 거치며 신앙의 터전을 다짐.', false, 2);

END $$;
