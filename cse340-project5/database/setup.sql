-- Classifications
CREATE TABLE IF NOT EXISTS public.classification (
  classification_id   SERIAL PRIMARY KEY,
  classification_name VARCHAR(30) NOT NULL
);

-- Inventory
CREATE TABLE IF NOT EXISTS public.inventory (
  inv_id            SERIAL PRIMARY KEY,
  inv_make          VARCHAR(30)        NOT NULL,
  inv_model         VARCHAR(30)        NOT NULL,
  inv_year          INT                NOT NULL,
  inv_description   TEXT               NOT NULL,
  inv_image         VARCHAR(200)       NOT NULL,
  inv_thumbnail     VARCHAR(200)       NOT NULL,
  inv_price         NUMERIC(9,0)       NOT NULL,
  inv_miles         INT                NOT NULL,
  inv_color         VARCHAR(30)        NOT NULL,
  classification_id INT REFERENCES public.classification(classification_id) NOT NULL
);

-- Accounts
CREATE TABLE IF NOT EXISTS public.account (
  account_id        SERIAL PRIMARY KEY,
  account_firstname VARCHAR(30)        NOT NULL,
  account_lastname  VARCHAR(30)        NOT NULL,
  account_email     VARCHAR(100)       NOT NULL UNIQUE,
  account_password  VARCHAR(200)       NOT NULL,
  account_type      VARCHAR(10)        NOT NULL DEFAULT 'Client'
                    CHECK (account_type IN ('Client', 'Employee', 'Admin'))
);

-- Session table (for connect-pg-simple)
CREATE TABLE IF NOT EXISTS public.session (
  sid    VARCHAR        NOT NULL COLLATE "default",
  sess   JSON           NOT NULL,
  expire TIMESTAMP(6)   NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON public.session (expire);

-- Seed some classifications
INSERT INTO public.classification (classification_name)
VALUES ('Custom'), ('Electric'), ('Sport'), ('SUV'), ('Truck')
ON CONFLICT DO NOTHING;
