--
-- PostgreSQL database dump
--

\restrict N10TPM3XyufahpLs0R9MJzl14jlJ8SmsfHauUWpL2ozFIUNSqPU0IjvPEwgviZP

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: catalog_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalog_items (
    id integer NOT NULL,
    category text NOT NULL,
    name text NOT NULL,
    unit text DEFAULT 'copë'::text NOT NULL,
    purchase_price real DEFAULT 0,
    sale_price real DEFAULT 0,
    current_stock real DEFAULT 0,
    min_stock_level real DEFAULT 0,
    notes text,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.catalog_items OWNER TO postgres;

--
-- Name: catalog_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalog_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_items_id_seq OWNER TO postgres;

--
-- Name: catalog_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalog_items_id_seq OWNED BY public.catalog_items.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name text NOT NULL,
    phone text,
    address text,
    email text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    description text NOT NULL,
    amount real NOT NULL,
    category text DEFAULT 'tjeter'::text NOT NULL,
    date text NOT NULL,
    job_id integer,
    supplier_id integer,
    notes text,
    created_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    job_id integer NOT NULL,
    client_id integer,
    rating integer DEFAULT 5 NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: job_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_snapshots (
    id integer NOT NULL,
    job_id integer NOT NULL,
    snapshot_type text DEFAULT 'quote'::text NOT NULL,
    material_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    prices jsonb DEFAULT '{}'::jsonb NOT NULL,
    purchase_prices jsonb DEFAULT '{}'::jsonb NOT NULL,
    total_sale real DEFAULT 0,
    total_purchase real DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.job_snapshots OWNER TO postgres;

--
-- Name: job_snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_snapshots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_snapshots_id_seq OWNER TO postgres;

--
-- Name: job_snapshots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_snapshots_id_seq OWNED BY public.job_snapshots.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    invoice_number text,
    client_name text NOT NULL,
    client_phone text,
    client_address text NOT NULL,
    work_date text NOT NULL,
    work_type text NOT NULL,
    category text DEFAULT 'electric'::text,
    status text DEFAULT 'oferte'::text,
    notes text,
    scheduled_date text,
    location_url text,
    is_template integer DEFAULT 0,
    user_id integer,
    client_id integer,
    discount_type text DEFAULT 'percent'::text,
    discount_value real DEFAULT 0,
    vat_rate real DEFAULT 0,
    payment_status text DEFAULT 'pa_paguar'::text,
    paid_amount real DEFAULT 0,
    payment_date text,
    payment_method text,
    warranty_months integer DEFAULT 12,
    completed_date text,
    table1_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    table2_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    camera_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    intercom_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    alarm_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    service_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    prices jsonb DEFAULT '{}'::jsonb NOT NULL,
    purchase_prices jsonb DEFAULT '{}'::jsonb NOT NULL,
    checklist_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    supplier_id integer
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    job_id integer,
    catalog_item_id integer,
    is_read integer DEFAULT 0 NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_history (
    id integer NOT NULL,
    catalog_item_id integer NOT NULL,
    item_name text NOT NULL,
    old_purchase_price real,
    new_purchase_price real,
    old_sale_price real,
    new_sale_price real,
    changed_by text,
    changed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.price_history OWNER TO postgres;

--
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.price_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_history_id_seq OWNER TO postgres;

--
-- Name: price_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.price_history_id_seq OWNED BY public.price_history.id;


--
-- Name: stock_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_entries (
    id integer NOT NULL,
    catalog_item_id integer NOT NULL,
    item_name text NOT NULL,
    entry_type text DEFAULT 'in'::text NOT NULL,
    quantity real NOT NULL,
    previous_stock real DEFAULT 0,
    new_stock real DEFAULT 0,
    job_id integer,
    notes text,
    created_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.stock_entries OWNER TO postgres;

--
-- Name: stock_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_entries_id_seq OWNER TO postgres;

--
-- Name: stock_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_entries_id_seq OWNED BY public.stock_entries.id;


--
-- Name: supplier_prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_prices (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    catalog_item_id integer NOT NULL,
    price real DEFAULT 0 NOT NULL,
    notes text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.supplier_prices OWNER TO postgres;

--
-- Name: supplier_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_prices_id_seq OWNER TO postgres;

--
-- Name: supplier_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_prices_id_seq OWNED BY public.supplier_prices.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    address text,
    categories jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'technician'::text NOT NULL,
    phone text,
    email text,
    is_active integer DEFAULT 1 NOT NULL,
    assigned_categories jsonb DEFAULT '[]'::jsonb,
    two_factor_secret text,
    two_factor_enabled integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: catalog_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalog_items ALTER COLUMN id SET DEFAULT nextval('public.catalog_items_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: job_snapshots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_snapshots ALTER COLUMN id SET DEFAULT nextval('public.job_snapshots_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: price_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history ALTER COLUMN id SET DEFAULT nextval('public.price_history_id_seq'::regclass);


--
-- Name: stock_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_entries ALTER COLUMN id SET DEFAULT nextval('public.stock_entries_id_seq'::regclass);


--
-- Name: supplier_prices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_prices ALTER COLUMN id SET DEFAULT nextval('public.supplier_prices_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: catalog_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalog_items (id, category, name, unit, purchase_price, sale_price, current_stock, min_stock_level, notes, sort_order, created_at) FROM stdin;
1	Pajisje elektrike	Shteg EM2	copë	2.5	5	0	0	\N	0	2026-02-12 16:16:09.159508
2	Pajisje elektrike	Shteg EM1	copë	1.5	3	0	0	\N	0	2026-02-12 16:16:09.165363
3	Pajisje elektrike	Ndërprerës Alternativ	copë	3	6	0	0	\N	0	2026-02-12 16:16:09.169497
4	Pajisje elektrike	Ndërprerës Kryqëzor	copë	3.5	7	0	0	\N	0	2026-02-12 16:16:09.173364
5	Pajisje elektrike	Ndërprerës i Thjeshtë	copë	2	4	0	0	\N	0	2026-02-12 16:16:09.177724
6	Pajisje elektrike	Tapa mbyllëse	copë	0.3	0.8	0	0	\N	0	2026-02-12 16:16:09.181471
7	Pajisje elektrike	Ndërprerës për roletne	copë	4	8	0	0	\N	0	2026-02-12 16:16:09.185331
8	Pajisje elektrike	Ram mbajtës 7 EM	copë	4.5	8	0	0	\N	0	2026-02-12 16:16:09.188971
13	Pajisje elektrike	Fasunga	copë	1.2	2.5	0	0	\N	0	2026-02-12 16:16:09.205865
40	Kamera	DAHUA DVR DH-XVR5104HS-I3 V3 (4 kanale)	COPË	85	89	0	0	\N	1	2026-02-12 16:16:09.292174
37	Kamera	Montim & konfigurim kamerash	COPË	0	25	0	0	\N	2	2026-02-12 16:16:09.284279
38	Kamera	Kabell RG59+power Allstrong.	METËR	0.28	0.3	0	0	\N	3	2026-02-12 16:16:09.2869
45	Kamera	Konektor Kamera BNC rg59HQ	COPË	1.3	2	0	0	\N	4	2026-02-12 16:16:09.305838
42	Kamera	HDD 1TB	COPË	30	69	0	0	\N	5	2026-02-12 16:16:09.297247
48	Kamera	MBAJTES KAMERE	COPË	1.5	2.5	0	0	\N	6	2026-02-12 16:16:09.314024
49	Kamera	DAHUA Power Supply 4ch 30W	COPË	14	22	0	0	\N	7	2026-02-12 16:16:09.316761
15	Kabllo & Gypa	Kabell 5×10	metër	4.5	8	0	0	\N	0	2026-02-12 16:16:09.212545
16	Kabllo & Gypa	Kabell 5×2.5	metër	2.2	4	0	0	\N	0	2026-02-12 16:16:09.215517
17	Kabllo & Gypa	Kabell 3×2.5	metër	1.5	2.8	0	0	\N	0	2026-02-12 16:16:09.218812
18	Kabllo & Gypa	Kabell 3×1.5	metër	1	1.8	0	0	\N	0	2026-02-12 16:16:09.221528
19	Kabllo & Gypa	Kabell 4×0.75	metër	0.6	1.2	0	0	\N	0	2026-02-12 16:16:09.224702
20	Kabllo & Gypa	Kabëll antene	metër	0.4	0.8	0	0	\N	0	2026-02-12 16:16:09.227746
21	Kabllo & Gypa	Kabllo Kamerave	metër	0.5	1	0	0	\N	0	2026-02-12 16:16:09.231275
22	Kabllo & Gypa	Kabëll UTP për interfon	metër	0.35	0.7	0	0	\N	0	2026-02-12 16:16:09.234786
23	Kabllo & Gypa	Tabelë e siguresave (3 rendëshe)	copë	25	45	0	0	\N	0	2026-02-12 16:16:09.238846
24	Kabllo & Gypa	Kuti modulare M7	copë	3.5	6	0	0	\N	0	2026-02-12 16:16:09.241553
25	Kabllo & Gypa	Kuti modulare M4	copë	2.5	4.5	0	0	\N	0	2026-02-12 16:16:09.245583
26	Kabllo & Gypa	Kuti modulare M3	copë	2	3.5	0	0	\N	0	2026-02-12 16:16:09.248525
27	Kabllo & Gypa	Kuti modulare M2	copë	1.5	3	0	0	\N	0	2026-02-12 16:16:09.251567
28	Kabllo & Gypa	Kuti FI 150	copë	5	9	0	0	\N	0	2026-02-12 16:16:09.255
51	Interfon	Monitor Interfoni	copë	35	65	0	0	\N	0	2026-02-12 16:16:09.322215
52	Interfon	Panel i jashtëm	copë	25	45	0	0	\N	0	2026-02-12 16:16:09.324426
53	Interfon	Adapter Interfoni	copë	8	15	0	0	\N	0	2026-02-12 16:16:09.327227
54	Interfon	Kuti për monitor	copë	5	9	0	0	\N	0	2026-02-12 16:16:09.329416
55	Interfon	Kabell Interfoni UTP	metër	0.35	0.7	0	0	\N	0	2026-02-12 16:16:09.332297
56	Alarm	Panel alarmi	copë	45	85	0	0	\N	0	2026-02-12 16:16:09.335443
57	Alarm	Tastierë alarmi	copë	20	38	0	0	\N	0	2026-02-12 16:16:09.339201
58	Alarm	Sirenë brenda	copë	8	15	0	0	\N	0	2026-02-12 16:16:09.341654
59	Alarm	Sirenë jashtë	copë	15	28	0	0	\N	0	2026-02-12 16:16:09.344398
60	Alarm	Sensor lëvizje (PIR)	copë	7	14	0	0	\N	0	2026-02-12 16:16:09.346967
61	Alarm	Magnet dere/dritare	copë	4	8	0	0	\N	0	2026-02-12 16:16:09.349727
62	Alarm	Battery 12V	copë	5	10	0	0	\N	0	2026-02-12 16:16:09.351765
63	Punë/Shërbime	Ndërrim llusteri	copë	0	10	0	0	\N	0	2026-02-12 16:16:09.354636
64	Punë/Shërbime	Ndërrim shtikeri	copë	0	5	0	0	\N	0	2026-02-12 16:16:09.357383
65	Punë/Shërbime	Ndërrim ndërprerësi	copë	0	5	0	0	\N	0	2026-02-12 16:16:09.360224
66	Punë/Shërbime	Hapje kanal / shparingu	metër	0	3	0	0	\N	0	2026-02-12 16:16:09.362464
67	Punë/Shërbime	Montim gypi	metër	0	2	0	0	\N	0	2026-02-12 16:16:09.365447
68	Punë/Shërbime	Montim kutie modulare	copë	0	5	0	0	\N	0	2026-02-12 16:16:09.367885
69	Punë/Shërbime	Montim tabelë siguresash	copë	0	15	0	0	\N	0	2026-02-12 16:16:09.370854
70	Punë/Shërbime	Konfigurim kamera	set	0	30	0	0	\N	0	2026-02-12 16:16:09.373653
71	Punë/Shërbime	Konfigurim alarmi	set	0	25	0	0	\N	0	2026-02-12 16:16:09.376802
46	Kamera	Konektor Camera DC	COPË	1	1.25	0	0	\N	8	2026-02-12 16:16:09.30849
39	Kamera	Kamera Dahua 5MP DH-HAC-HFW1500 TLIMP-IL-A-LED 40m/3.6mm	COPË	40	46.99	0	0	\N	9	2026-02-12 16:16:09.28957
9	Pajisje elektrike	Ram mbajtës 4 EM	copë	2.8	5.5	0	0	\N	0	2026-02-12 16:16:09.192936
10	Pajisje elektrike	Ram mbajtës 3 EM	copë	2.2	4.5	0	0	\N	0	2026-02-12 16:16:09.196447
11	Pajisje elektrike	Ram mbajtës 2 EM	copë	1.8	3.5	0	0	\N	0	2026-02-12 16:16:09.199765
12	Pajisje elektrike	Indikator për banjo	copë	3.5	7	0	0	\N	0	2026-02-12 16:16:09.202547
14	Pajisje elektrike	Aster Zile	copë	2.5	5	0	0	\N	0	2026-02-12 16:16:09.209178
29	Kabllo & Gypa	Cevë (GYP) FI 32	metër	0.8	1.5	0	0	\N	0	2026-02-12 16:16:09.259749
30	Kabllo & Gypa	Cevë (GYP) FI 25	metër	0.6	1.1	0	0	\N	0	2026-02-12 16:16:09.262312
31	Kabllo & Gypa	Cevë (GYP) FI 16	metër	0.4	0.8	0	0	\N	0	2026-02-12 16:16:09.265195
32	Kabllo & Gypa	Cevë (GYP) FI 11	metër	0.3	0.6	0	0	\N	0	2026-02-12 16:16:09.26744
33	Kabllo & Gypa	GIPS	copë	3	5.5	0	0	\N	0	2026-02-12 16:16:09.270813
34	Kabllo & Gypa	Trakë shparingu	copë	1.5	3	0	0	\N	0	2026-02-12 16:16:09.273548
35	Kabllo & Gypa	Gozhda betoni	copë	0.05	0.1	0	0	\N	0	2026-02-12 16:16:09.277202
36	Kabllo & Gypa	Vazhduese gypi	copë	0.2	0.5	0	0	\N	0	2026-02-12 16:16:09.280493
72	Punë/Shërbime	Shërbim terreni	orë	0	15	0	0	\N	0	2026-02-12 16:16:09.379829
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, phone, address, email, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, description, amount, category, date, job_id, supplier_id, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, job_id, client_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: job_snapshots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_snapshots (id, job_id, snapshot_type, material_data, prices, purchase_prices, total_sale, total_purchase, created_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, invoice_number, client_name, client_phone, client_address, work_date, work_type, category, status, notes, scheduled_date, location_url, is_template, user_id, client_id, discount_type, discount_value, vat_rate, payment_status, paid_amount, payment_date, payment_method, warranty_months, completed_date, table1_data, table2_data, camera_data, intercom_data, alarm_data, service_data, prices, purchase_prices, checklist_data, created_at, updated_at, supplier_id) FROM stdin;
3	ELK-001	Arben Hoxha	044 123 456	Rruga B, Prishtinë	2026-02-12	Instalim i ri	electric	oferte	Kati 2.	\N	\N	0	\N	\N	percent	0	0	pa_paguar	0	\N	\N	12	\N	{"Shteg EM2": {"Kuzhina": 1, "Salloni": 2}}	{"Kabell 3×1.5": 100}	{}	{}	{}	{}	{}	{}	{}	2026-02-12 17:24:16.76771	2026-02-12 17:24:16.76771	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, title, message, job_id, catalog_item_id, is_read, user_id, created_at) FROM stdin;
1	upcoming_work	Pune Sot	 - Instalim i ri (ELK-002)	2	\N	0	1	2026-02-12 16:25:55.385529
2	upcoming_work	Pune Sot	Arben Hoxha - Instalim i ri (ELK-001)	3	\N	0	\N	2026-02-12 17:26:00.664204
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_history (id, catalog_item_id, item_name, old_purchase_price, new_purchase_price, old_sale_price, new_sale_price, changed_by, changed_at) FROM stdin;
\.


--
-- Data for Name: stock_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_entries (id, catalog_item_id, item_name, entry_type, quantity, previous_stock, new_stock, job_id, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: supplier_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_prices (id, supplier_id, catalog_item_id, price, notes, updated_at) FROM stdin;
3	2	38	0.28	\N	2026-02-12 16:38:15.317511
4	2	45	1.3	\N	2026-02-12 16:38:37.337351
5	2	42	30	\N	2026-02-12 16:39:13.142805
6	2	48	1.5	\N	2026-02-12 16:39:21.409437
7	2	49	14	\N	2026-02-12 16:39:32.163704
8	2	46	1	\N	2026-02-12 16:39:59.833275
9	2	39	40	\N	2026-02-12 16:40:14.825589
10	3	40	89	\N	2026-02-12 16:41:33.308
12	3	38	0.35	\N	2026-02-12 16:41:52.282937
13	3	45	1.5	\N	2026-02-12 16:42:10.663539
14	3	42	45	\N	2026-02-12 16:42:19.74314
15	3	48	2	\N	2026-02-12 16:42:28.858922
16	3	49	16	\N	2026-02-12 16:42:38.275106
17	3	46	2	\N	2026-02-12 16:42:48.350734
18	3	39	45	\N	2026-02-12 16:43:03.262745
2	2	40	155	\N	2026-02-12 16:58:55.973
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name, phone, email, address, categories, notes, created_at) FROM stdin;
2	Betronik 	 044 125 272	betronik@yahoo.com	285 Mbretëresha Teutë, Pejë 30000	["Kamera", "Alarme"]	Kamera, Alarme, etj	2026-02-12 16:34:22.056001
3	Mustafa Commerc	402002	mustafas22@gmail.com	ramun	["Kamera", "Alarm"]	i pari	2026-02-12 16:40:38.913273
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
JJ3MnhW8ObIT66srS-cc-hDrBM3CZPsQ	{"cookie":{"originalMaxAge":2592000000,"expires":"2026-03-14T16:47:27.213Z","secure":false,"httpOnly":true,"path":"/"},"userId":1,"role":"admin","username":"admin","fullName":"Admin Elektronova"}	2026-03-14 23:42:41
kLDzKMv8r4PT4B6JJ6gJMnGhAhWCc7dv	{"cookie":{"originalMaxAge":2592000000,"expires":"2026-03-14T20:40:31.725Z","secure":false,"httpOnly":true,"path":"/"},"userId":1,"role":"admin","username":"admin","fullName":"Admin Elektronova"}	2026-03-14 23:45:39
lamnY2keLjuy6C-h2yqBKsCRJ57VWMCh	{"cookie":{"originalMaxAge":2592000000,"expires":"2026-03-14T17:38:58.703Z","secure":false,"httpOnly":true,"path":"/"},"userId":1,"role":"admin","username":"admin","fullName":"Admin Elektronova"}	2026-03-14 20:40:13
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, full_name, role, phone, email, is_active, assigned_categories, two_factor_secret, two_factor_enabled, created_at) FROM stdin;
1	admin	$2b$10$v9CeKuEToEvbOoBGKdqlleHy9uglNDClDXe3qW81/ijQ2QsfP/J1i	Admin Elektronova	admin	+383 49 771 673	\N	1	[]	\N	0	2026-02-12 16:16:09.49189
\.


--
-- Name: catalog_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalog_items_id_seq', 72, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 1, false);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 1, false);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- Name: job_snapshots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_snapshots_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 3, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);


--
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.price_history_id_seq', 1, false);


--
-- Name: stock_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_entries_id_seq', 1, false);


--
-- Name: supplier_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_prices_id_seq', 19, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: catalog_items catalog_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT catalog_items_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: job_snapshots job_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_snapshots
    ADD CONSTRAINT job_snapshots_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: stock_entries stock_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_entries
    ADD CONSTRAINT stock_entries_pkey PRIMARY KEY (id);


--
-- Name: supplier_prices supplier_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_prices
    ADD CONSTRAINT supplier_prices_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- Name: supplier_catalog_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX supplier_catalog_unique ON public.supplier_prices USING btree (supplier_id, catalog_item_id);


--
-- PostgreSQL database dump complete
--

\unrestrict N10TPM3XyufahpLs0R9MJzl14jlJ8SmsfHauUWpL2ozFIUNSqPU0IjvPEwgviZP

