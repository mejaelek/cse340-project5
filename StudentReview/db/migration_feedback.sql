CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (
        rating BETWEEN 1 AND 5
    ),
    difficulty VARCHAR(20) NOT NULL CHECK (
        difficulty IN (
            'very_easy',
            'easy',
            'moderate',
            'challenging',
            'very_challenging'
        )
    ),
    enjoyed TEXT NOT NULL CHECK (
        char_length(enjoyed) BETWEEN 10 AND 1000
    ),
    improve TEXT NOT NULL CHECK (
        char_length(improve) BETWEEN 10 AND 1000
    ),
    recommend VARCHAR(5) NOT NULL CHECK (recommend IN ('yes', 'no', 'maybe')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, student_id) -- one review per student per course
);
CREATE INDEX idx_feedback_course ON feedback(course_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);