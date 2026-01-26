--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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

--
-- Name: core; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO postgres;

--
-- Name: graph; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA graph;


ALTER SCHEMA graph OWNER TO postgres;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: touch_updated_at(); Type: FUNCTION; Schema: meta; Owner: postgres
--

CREATE FUNCTION meta.touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION meta.touch_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: node; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.node (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kind text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE core.node OWNER TO postgres;

--
-- Name: edge; Type: TABLE; Schema: graph; Owner: postgres
--

CREATE TABLE graph.edge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_id uuid NOT NULL,
    target_id uuid NOT NULL,
    kind text DEFAULT 'related_to'::text NOT NULL,
    weight double precision DEFAULT 1.0 NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT edge_no_self CHECK ((source_id <> target_id))
);


ALTER TABLE graph.edge OWNER TO postgres;

--
-- Name: node_kind; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.node_kind (
    kind text NOT NULL
);


ALTER TABLE meta.node_kind OWNER TO postgres;

--
-- Name: node node_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.node
    ADD CONSTRAINT node_pkey PRIMARY KEY (id);


--
-- Name: edge edge_pkey; Type: CONSTRAINT; Schema: graph; Owner: postgres
--

ALTER TABLE ONLY graph.edge
    ADD CONSTRAINT edge_pkey PRIMARY KEY (id);


--
-- Name: edge edge_unique; Type: CONSTRAINT; Schema: graph; Owner: postgres
--

ALTER TABLE ONLY graph.edge
    ADD CONSTRAINT edge_unique UNIQUE (source_id, target_id, kind);


--
-- Name: node_kind node_kind_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.node_kind
    ADD CONSTRAINT node_kind_pkey PRIMARY KEY (kind);


--
-- Name: core_node_topic_label_idx; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX core_node_topic_label_idx ON core.node USING btree (((payload ->> 'label'::text))) WHERE (kind = 'topic'::text);


--
-- Name: core_topic_label_unique; Type: INDEX; Schema: core; Owner: postgres
--

CREATE UNIQUE INDEX core_topic_label_unique ON core.node USING btree (((payload ->> 'label'::text))) WHERE (kind = 'topic'::text);


--
-- Name: edge_kind_idx; Type: INDEX; Schema: graph; Owner: postgres
--

CREATE INDEX edge_kind_idx ON graph.edge USING btree (kind);


--
-- Name: edge_source_idx; Type: INDEX; Schema: graph; Owner: postgres
--

CREATE INDEX edge_source_idx ON graph.edge USING btree (source_id);


--
-- Name: edge_target_idx; Type: INDEX; Schema: graph; Owner: postgres
--

CREATE INDEX edge_target_idx ON graph.edge USING btree (target_id);


--
-- Name: edge_weight_idx; Type: INDEX; Schema: graph; Owner: postgres
--

CREATE INDEX edge_weight_idx ON graph.edge USING btree (weight);


--
-- Name: node core_node_touch; Type: TRIGGER; Schema: core; Owner: postgres
--

CREATE TRIGGER core_node_touch BEFORE UPDATE ON core.node FOR EACH ROW EXECUTE FUNCTION meta.touch_updated_at();


--
-- Name: node node_kind_valid; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.node
    ADD CONSTRAINT node_kind_valid FOREIGN KEY (kind) REFERENCES meta.node_kind(kind);


--
-- Name: edge edge_source_id_fkey; Type: FK CONSTRAINT; Schema: graph; Owner: postgres
--

ALTER TABLE ONLY graph.edge
    ADD CONSTRAINT edge_source_id_fkey FOREIGN KEY (source_id) REFERENCES core.node(id) ON DELETE CASCADE;


--
-- Name: edge edge_target_id_fkey; Type: FK CONSTRAINT; Schema: graph; Owner: postgres
--

ALTER TABLE ONLY graph.edge
    ADD CONSTRAINT edge_target_id_fkey FOREIGN KEY (target_id) REFERENCES core.node(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

