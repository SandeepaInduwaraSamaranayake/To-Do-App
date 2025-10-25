import os
import os
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

# --- Database Setup ---

# The connection URL is passed via environment variable from docker-compose
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://user:password@localhost:5432/todo_db")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get the DB session
def get_db():
    """Provides a database session for use in endpoint dependencies."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SQLAlchemy Model ---

class DBTask(Base):
    """SQLAlchemy model for the 'task' table."""
    __tablename__ = "task"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

# --- Pydantic Schemas ---

# Schema for creating a new task (Request body)
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

    class Config:
        # Pydantic validation: Ensure title is not empty
        min_anystr_length = 1

# Schema for reading and returning a task (Response body)
class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- FastAPI Application ---

app = FastAPI(
    title="ToDo Task API",
    description="A simple REST API for managing To-Do tasks, strictly limited to the top 5 incomplete tasks.",
    version="1.0.0"
)

# --- REST Endpoints ---

@app.get("/tasks", response_model=List[TaskOut])
def read_tasks(db: Session = Depends(get_db)):
    """
    Retrieve the **most recent 5** incomplete to-do tasks.
    Completed tasks are excluded. Tasks are ordered by creation date descending.
    """
    # Query for incomplete tasks, ordered by creation_at descending, and limited to 5
    tasks = db.query(DBTask).filter(DBTask.is_completed == False).order_by(DBTask.created_at.desc()).limit(5).all()
    
    return tasks

@app.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new to-do task with a title and description.
    """
    if not task.title or len(task.title.strip()) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty.")

    db_task = DBTask(title=task.title, description=task.description)
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task

@app.patch("/tasks/{task_id}/complete", response_model=TaskOut)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Mark a specific task as completed.
    """
    db_task = db.query(DBTask).filter(DBTask.id == task_id).first()
    
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if db_task.is_completed:
        # Optionally handle already completed task gracefully
        return db_task 

    db_task.is_completed = True
    db.commit()
    db.refresh(db_task)
    
    return db_task
