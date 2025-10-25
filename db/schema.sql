-- Drop table if it exists to allow for idempotent startup
DROP TABLE IF EXISTS task;

-- Create the task table to store To-Do items
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    -- Timestamp for sorting and retrieving the latest tasks
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on is_completed and created_at for efficient querying of the 5 latest incomplete tasks
CREATE INDEX idx_incomplete_latest ON task (is_completed, created_at DESC) WHERE is_completed = FALSE;

-- Optional initial data for testing
INSERT INTO task (title, description) VALUES
('Buy books', 'Buy books for the next school year'),
('Clean home', 'Need to clean the bed room'),
('Takehome assignment', 'Finish the mid-term assignment'),
('Play Cricket', 'Plan the soft ball cricket match on next Sunday'),
('Help Saman', 'Saman need help with his software project'),
('Older Task 1', 'This is an old task.'),
('Older Task 2', 'This is another old task.');
