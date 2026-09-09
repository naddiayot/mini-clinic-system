--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2026-09-09 20:07:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 222 (class 1259 OID 25954)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    user_id integer,
    name character varying(100) NOT NULL,
    specialization character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25953)
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- TOC entry 232 (class 1259 OID 26037)
-- Name: medical_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_actions (
    id integer NOT NULL,
    medical_record_id integer NOT NULL,
    action_name character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_actions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 26036)
-- Name: medical_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_actions_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 231
-- Name: medical_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_actions_id_seq OWNED BY public.medical_actions.id;


--
-- TOC entry 230 (class 1259 OID 26020)
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id integer NOT NULL,
    registration_id integer NOT NULL,
    complaint text,
    blood_pressure character varying(20),
    temperature character varying(10),
    weight character varying(10),
    height character varying(10),
    diagnosis text,
    treatment_plan text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 26019)
-- Name: medical_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 229
-- Name: medical_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_id_seq OWNED BY public.medical_records.id;


--
-- TOC entry 220 (class 1259 OID 25938)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    medical_record_no character varying(20) NOT NULL,
    nik character varying(16) NOT NULL,
    name character varying(100) NOT NULL,
    gender character varying(10) NOT NULL,
    birth_date date NOT NULL,
    phone character varying(20),
    address text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT patients_gender_check CHECK (((gender)::text = ANY ((ARRAY['L'::character varying, 'P'::character varying])::text[])))
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25937)
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 219
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- TOC entry 224 (class 1259 OID 25967)
-- Name: polyclinics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.polyclinics (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.polyclinics OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25966)
-- Name: polyclinics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.polyclinics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.polyclinics_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 223
-- Name: polyclinics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.polyclinics_id_seq OWNED BY public.polyclinics.id;


--
-- TOC entry 234 (class 1259 OID 26050)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id integer NOT NULL,
    medical_record_id integer NOT NULL,
    medicine_name character varying(150) NOT NULL,
    dosage character varying(100),
    quantity character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 26049)
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 233
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- TOC entry 228 (class 1259 OID 26003)
-- Name: queues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queues (
    id integer NOT NULL,
    registration_id integer NOT NULL,
    queue_number character varying(10) NOT NULL,
    status character varying(20) DEFAULT 'menunggu'::character varying NOT NULL,
    called_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT queues_status_check CHECK (((status)::text = ANY ((ARRAY['menunggu'::character varying, 'dipanggil'::character varying, 'selesai'::character varying])::text[])))
);


ALTER TABLE public.queues OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 26002)
-- Name: queues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queues_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 227
-- Name: queues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queues_id_seq OWNED BY public.queues.id;


--
-- TOC entry 226 (class 1259 OID 25974)
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    poly_id integer NOT NULL,
    visit_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_type character varying(30) NOT NULL,
    initial_complaint text,
    status character varying(20) DEFAULT 'menunggu'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT registrations_status_check CHECK (((status)::text = ANY ((ARRAY['menunggu'::character varying, 'check_in'::character varying, 'pemeriksaan'::character varying, 'selesai'::character varying])::text[])))
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25973)
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- TOC entry 218 (class 1259 OID 25926)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'dokter'::character varying, 'petugas_pendaftaran'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25925)
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
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4788 (class 2604 OID 25957)
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 26040)
-- Name: medical_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_actions ALTER COLUMN id SET DEFAULT nextval('public.medical_actions_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 26023)
-- Name: medical_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records ALTER COLUMN id SET DEFAULT nextval('public.medical_records_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 25941)
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 25970)
-- Name: polyclinics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polyclinics ALTER COLUMN id SET DEFAULT nextval('public.polyclinics_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 26053)
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 26006)
-- Name: queues id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queues ALTER COLUMN id SET DEFAULT nextval('public.queues_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 25977)
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 25929)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4995 (class 0 OID 25954)
-- Dependencies: 222
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, user_id, name, specialization, created_at) FROM stdin;
1	\N	Dr. Budi	Umum	2026-09-08 13:59:48.070778
2	\N	dr. Andi Wijaya	Umum	2026-09-09 13:55:03.870833
3	\N	dr. Siti Rahma	Gigi	2026-09-09 13:55:03.870833
4	\N	dr. Budi Santoso	Anak	2026-09-09 13:55:03.870833
\.


--
-- TOC entry 5005 (class 0 OID 26037)
-- Dependencies: 232
-- Data for Name: medical_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_actions (id, medical_record_id, action_name, created_at) FROM stdin;
1	1	Nebulizer	2026-09-08 15:34:42.583716
2	1	Pengukuran saturasi oksigen	2026-09-08 15:34:42.583716
3	2	-	2026-09-09 14:42:39.478381
\.


--
-- TOC entry 5003 (class 0 OID 26020)
-- Dependencies: 230
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, registration_id, complaint, blood_pressure, temperature, weight, height, diagnosis, treatment_plan, created_at) FROM stdin;
1	1	Demam sejak 2 hari, batuk berdahak	120/80	38.5	60	165	ISPA (Infeksi Saluran Pernapasan Akut)	Istirahat cukup, minum air putih banyak, kontrol jika tidak membaik dalam 3 hari	2026-09-08 15:34:42.583716
2	4	Sering sakit pinggang	110/80	35	57	162	-	-	2026-09-09 14:42:39.478381
\.


--
-- TOC entry 4993 (class 0 OID 25938)
-- Dependencies: 220
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, medical_record_no, nik, name, gender, birth_date, phone, address, created_at, updated_at) FROM stdin;
1	RM-000001	3273010101990001	Budi Santoso	L	1990-01-01	081234567890	Jl. Merdeka No. 10, Bandung	2026-09-08 15:08:39.881899	2026-09-08 15:08:39.881899
3	RM-000002	4567894567892345	Meira	P	2009-02-09	08123456789	Jln Sukasukaa	2026-09-09 13:40:53.58748	2026-09-09 13:40:53.58748
4	RM-000004	4567894567892349	Saepul anwar	L	2017-03-01	-	Jln ciuyah no 19 	2026-09-09 14:25:51.31037	2026-09-09 14:25:51.31037
5	RM-000005	9876543210123456	Asep	L	1980-08-09	-	Jln Pasir Koja	2026-09-09 17:31:47.212976	2026-09-09 17:31:47.212976
\.


--
-- TOC entry 4997 (class 0 OID 25967)
-- Dependencies: 224
-- Data for Name: polyclinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.polyclinics (id, name) FROM stdin;
1	Poli Umum
2	Poli Gigi
3	Poli Anak
\.


--
-- TOC entry 5007 (class 0 OID 26050)
-- Dependencies: 234
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, medical_record_id, medicine_name, dosage, quantity, created_at) FROM stdin;
1	1	Paracetamol 500mg	3x1 setelah makan	10 tablet	2026-09-08 15:34:42.583716
2	1	OBH Combi Syrup	3x1 sendok takar	1 botol	2026-09-08 15:34:42.583716
3	2	Oskadon sp	2x1 hari	5	2026-09-09 14:42:39.478381
\.


--
-- TOC entry 5001 (class 0 OID 26003)
-- Dependencies: 228
-- Data for Name: queues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queues (id, registration_id, queue_number, status, called_at, created_at) FROM stdin;
1	1	A001	dipanggil	2026-09-08 15:20:28.618856	2026-09-08 15:18:21.818938
2	2	A001	selesai	2026-09-09 14:23:39.783034	2026-09-09 14:13:14.435524
3	3	A002	dipanggil	2026-09-09 14:26:59.263671	2026-09-09 14:26:28.551248
4	4	A003	selesai	2026-09-09 17:58:51.570817	2026-09-09 14:28:40.146503
\.


--
-- TOC entry 4999 (class 0 OID 25974)
-- Dependencies: 226
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrations (id, patient_id, doctor_id, poly_id, visit_date, payment_type, initial_complaint, status, created_at, updated_at) FROM stdin;
1	1	1	1	2026-09-08	Umum	Demam dan batuk sejak 2 hari	selesai	2026-09-08 15:18:21.818938	2026-09-08 15:34:42.583716
2	3	1	1	2026-09-09	BPJS	Sakit hatii hihi	selesai	2026-09-09 14:13:14.435524	2026-09-09 14:14:08.936706
3	4	3	3	2026-09-09	Umum	Batuk dan pilek	selesai	2026-09-09 14:26:28.551248	2026-09-09 14:27:36.612379
4	1	2	1	2026-09-09	Umum	Sakit pinggang 	selesai	2026-09-09 14:28:40.146503	2026-09-09 14:42:39.478381
\.


--
-- TOC entry 4991 (class 0 OID 25926)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at, updated_at) FROM stdin;
1	Administrator	admin@clinic.com	$2b$10$EQ8/Tq9ZQxpL5UaitvWP4uCdsufO5LTzFGrYoMXbdHpLeJdfypSqe	admin	2026-09-08 13:59:47.711627	2026-09-08 13:59:47.711627
2	Dr. Budi	dokter@clinic.com	$2b$10$Pq257KkIxjKauOgaLgw6zuQJkQNVtf1dGFFoXuwKUBtkEarT17Miq	dokter	2026-09-08 13:59:47.888567	2026-09-08 13:59:47.888567
3	Petugas Siti	petugas@clinic.com	$2b$10$H73AhrR0XAlrZVP6gp9LEuTQqHwElkmkURtBulDmNKoffpA9JPsVe	petugas_pendaftaran	2026-09-08 13:59:48.047953	2026-09-08 13:59:48.047953
\.


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 4, true);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 231
-- Name: medical_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_actions_id_seq', 3, true);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 229
-- Name: medical_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_id_seq', 2, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 5, true);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 223
-- Name: polyclinics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.polyclinics_id_seq', 3, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 233
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 3, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 227
-- Name: queues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queues_id_seq', 4, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 4, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4820 (class 2606 OID 25960)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 26043)
-- Name: medical_actions medical_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_actions
    ADD CONSTRAINT medical_actions_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 26028)
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 26030)
-- Name: medical_records medical_records_registration_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_registration_id_key UNIQUE (registration_id);


--
-- TOC entry 4814 (class 2606 OID 25950)
-- Name: patients patients_medical_record_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_medical_record_no_key UNIQUE (medical_record_no);


--
-- TOC entry 4816 (class 2606 OID 25952)
-- Name: patients patients_nik_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_nik_key UNIQUE (nik);


--
-- TOC entry 4818 (class 2606 OID 25948)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 25972)
-- Name: polyclinics polyclinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.polyclinics
    ADD CONSTRAINT polyclinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 26056)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 26011)
-- Name: queues queues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queues
    ADD CONSTRAINT queues_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 26013)
-- Name: queues queues_registration_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queues
    ADD CONSTRAINT queues_registration_id_key UNIQUE (registration_id);


--
-- TOC entry 4824 (class 2606 OID 25986)
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 25936)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4812 (class 2606 OID 25934)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 25961)
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4843 (class 2606 OID 26044)
-- Name: medical_actions medical_actions_medical_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_actions
    ADD CONSTRAINT medical_actions_medical_record_id_fkey FOREIGN KEY (medical_record_id) REFERENCES public.medical_records(id) ON DELETE CASCADE;


--
-- TOC entry 4842 (class 2606 OID 26031)
-- Name: medical_records medical_records_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.registrations(id) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 26057)
-- Name: prescriptions prescriptions_medical_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_medical_record_id_fkey FOREIGN KEY (medical_record_id) REFERENCES public.medical_records(id) ON DELETE CASCADE;


--
-- TOC entry 4841 (class 2606 OID 26014)
-- Name: queues queues_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queues
    ADD CONSTRAINT queues_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.registrations(id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 25992)
-- Name: registrations registrations_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4839 (class 2606 OID 25987)
-- Name: registrations registrations_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 25997)
-- Name: registrations registrations_poly_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_poly_id_fkey FOREIGN KEY (poly_id) REFERENCES public.polyclinics(id);


-- Completed on 2026-09-09 20:07:43

--
-- PostgreSQL database dump complete
--

