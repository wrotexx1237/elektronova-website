--
-- PostgreSQL database dump
--

\restrict AiQDp1yxHiEptCFQ3as1qksM47nfwX24NBTn4JGiEOudc6Y71AkLVrzmMWP2GG6

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
-- Name: catalog_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalog_items ALTER COLUMN id SET DEFAULT nextval('public.catalog_items_id_seq'::regclass);


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
-- Name: catalog_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalog_items_id_seq', 72, true);


--
-- Name: catalog_items catalog_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT catalog_items_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict AiQDp1yxHiEptCFQ3as1qksM47nfwX24NBTn4JGiEOudc6Y71AkLVrzmMWP2GG6

