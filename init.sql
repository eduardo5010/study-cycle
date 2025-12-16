-- StudyCycle Database Initialization
-- This file is executed when the PostgreSQL container starts for the first time

-- Create extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create study_cycles table
CREATE TABLE IF NOT EXISTS study_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    total_weeks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    study_cycle_id UUID REFERENCES study_cycles(id) ON DELETE CASCADE,
    hours INTEGER DEFAULT 2,
    minutes INTEGER DEFAULT 0,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    content TEXT,
    estimated_time INTEGER, -- in minutes
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (basic user management)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    is_teacher BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync_log table for offline/online synchronization
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'study_cycle', 'subject', 'course'
    entity_id UUID NOT NULL,
    operation VARCHAR(10) NOT NULL, -- 'create', 'update', 'delete'
    data JSONB,
    timestamp BIGINT NOT NULL,
    client_id VARCHAR(255),
    batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_study_cycle_id ON subjects(study_cycle_id);
CREATE INDEX IF NOT EXISTS idx_courses_subject_id ON courses(subject_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_user_id ON sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_entity ON sync_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_timestamp ON sync_log(timestamp);

-- Insert sample data for testing (optional)
-- This data will only be inserted if the tables are empty

DO $$
BEGIN
    -- Insert sample user if no users exist
    IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
        INSERT INTO users (email, name, password_hash, is_teacher)
        VALUES ('admin@studycycle.local', 'Administrator', '$2b$10$dummy.hash.for.testing', TRUE);
    END IF;

    -- Insert sample study cycle if no cycles exist
    IF NOT EXISTS (SELECT 1 FROM study_cycles LIMIT 1) THEN
        INSERT INTO study_cycles (name, description, user_id, total_weeks, status)
        VALUES (
            'Ciclo de Estudos - Semestre 2025.1',
            'Plano de estudos para o primeiro semestre de 2025',
            (SELECT id FROM users LIMIT 1),
            18,
            'active'
        );
    END IF;

    -- Insert sample subjects if no subjects exist
    IF NOT EXISTS (SELECT 1 FROM subjects LIMIT 1) THEN
        INSERT INTO subjects (name, description, study_cycle_id, hours, minutes, user_id)
        VALUES
            ('Matemática', 'Cálculo, Álgebra Linear e Geometria Analítica', (SELECT id FROM study_cycles LIMIT 1), 4, 30, (SELECT id FROM users LIMIT 1)),
            ('Física', 'Mecânica, Termodinâmica e Eletromagnetismo', (SELECT id FROM study_cycles LIMIT 1), 3, 15, (SELECT id FROM users LIMIT 1)),
            ('Programação', 'Estruturas de Dados e Algoritmos', (SELECT id FROM study_cycles LIMIT 1), 5, 0, (SELECT id FROM users LIMIT 1)),
            ('Banco de Dados', 'SQL, NoSQL e Modelagem de Dados', (SELECT id FROM study_cycles LIMIT 1), 3, 45, (SELECT id FROM users LIMIT 1));
    END IF;

    -- Insert sample courses if no courses exist
    IF NOT EXISTS (SELECT 1 FROM courses LIMIT 1) THEN
        INSERT INTO courses (title, description, subject_id, content, estimated_time, user_id)
        SELECT
            'Introdução aos Conceitos Básicos',
            'Aula introdutória cobrindo os fundamentos da disciplina',
            s.id,
            'Conteúdo detalhado da aula introdutória...',
            90,
            (SELECT id FROM users LIMIT 1)
        FROM subjects s
        LIMIT 4;
    END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_study_cycles_updated_at BEFORE UPDATE ON study_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (if needed for specific users)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO studycycle;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO studycycle;
