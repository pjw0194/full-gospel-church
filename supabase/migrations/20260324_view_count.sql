-- bulletins 테이블에 view_count 추가
ALTER TABLE bulletins ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- church_news 테이블에 view_count 추가
ALTER TABLE church_news ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- 조회수 증가 함수 (RPC)
CREATE OR REPLACE FUNCTION increment_view_count(table_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET view_count = view_count + 1 WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
