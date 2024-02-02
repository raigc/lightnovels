from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# LN list on json file to simulate a user database
lightnovels_path = "data/user/lightnovels.json"

with open(lightnovels_path, "r") as f:
    light_novels = json.load(f)

# LN list on json file to simulate a database
all_lightnovels_path = "data/lightnovels_db.json"
with open(all_lightnovels_path, "r") as f:
    all_light_novels = json.load(f)

class LightNovel(BaseModel):
    id: int
    title: str
    author: str
    status: str
    progress: str
    latest_release: str


def store_light_novels(light_novels):
    with open(lightnovels_path, "w+") as f:
        json.dump(light_novels,f, indent=2)

@app.get("/all_light_novels", response_model=List[LightNovel])
def get_all_light_novels():
    return all_light_novels

@app.get("/light_novels", response_model=List[LightNovel])
def get_light_novels():
    return light_novels

@app.get("/light_novels/{novel_id}", response_model=LightNovel)
def get_light_novel(novel_id: int):
    novel = next((novel for novel in light_novels if novel["id"] == novel_id), None)
    if novel is None:
        raise HTTPException(status_code=404, detail="Light Novel not found")
    return novel

@app.post("/light_novels", response_model=LightNovel)
def create_light_novel(novel: LightNovel):
    new_id = max(novel['id'] for novel in light_novels) + 1 if light_novels else 1
    new_novel = {**novel.dict()}
    new_novel["id"] = new_id
    light_novels.append(new_novel)
    store_light_novels(light_novels)
    return new_novel

@app.put("/light_novels/{novel_id}", response_model=LightNovel)
def update_light_novel(novel_id: int, novel: LightNovel):
    index = next((i for i, n in enumerate(light_novels) if n["id"] == novel_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Light Novel not found")
    light_novels[index] = {"id": novel_id, **novel.dict()}
    store_light_novels(light_novels)
    return light_novels[index]

@app.delete("/light_novels/{novel_id}", response_model=LightNovel)
def delete_light_novel(novel_id: int):
    novel = next((novel for novel in light_novels if novel["id"] == novel_id), None)
    if novel is None:
        raise HTTPException(status_code=404, detail="Light Novel not found")
    light_novels.remove(novel)
    store_light_novels(light_novels)
    return novel
