from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="2048 Game")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return FileResponse("static/index.html")

@app.post("/scores", response_model=schemas.ScoreResponse)
def create_score(score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    db_score = models.Score(
        player_name=score.player_name,
        score=score.score,
        highest_tile=score.highest_tile
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/scores", response_model=List[schemas.ScoreResponse])
def get_scores(db: Session = Depends(get_db)):
    scores = db.query(models.Score)\
        .order_by(models.Score.score.desc())\
        .limit(10)\
        .all()
    return scores

@app.get("/health")
def health_check():
    return {"status": "healthy"}