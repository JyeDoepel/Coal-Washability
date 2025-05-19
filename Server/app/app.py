from fastapi import Request, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.routes.data_upload import data_upload
from app.routes.update_plot import update_plot
from app.routes.read_doc import read_doc, read_report
from app.routes.account import signup, signin
from app.routes.authenticate import verify_token
from app.routes.edit_data import edit_data
from app.routes.settings import change_username, change_password, delete_account
from app.routes.save_plots import save_plot, saved_plots, get_saved_plot, example_plots, delete_saved_plot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root(request: Request):
    return {"message": "Hello World"}

@app.post("/data_upload")
async def data_upload_route(file: UploadFile = File(...)):
    return data_upload(file)

@app.post("/update_plot")
async def update_plot_route(request: Request):
    req = await request.json()
    return update_plot(req)

@app.get("/reports")
async def read_doc_route(request: Request):
    return read_doc()

@app.post("/signin")
async def signin_route(request: Request):
    req = await request.json()
    return signin(req)

@app.post("/signup")
async def signup_route(request: Request):
    req = await request.json()
    return signup(req)

@app.get("/authenticate/{token}")
async def verify_token_route(token: str):
    return verify_token(token)

@app.post("/edit_data")
async def edit_data_route(request: Request):
    req = await request.json()
    return edit_data(req)

@app.post("/change_username/{token}")
async def change_username_route(request: Request, token: str):
    req = await request.json()
    return change_username(req, token)

@app.post("/change_password/{token}")
async def change_password_route(request: Request, token: str):
    req = await request.json()
    return change_password(req, token)

@app.post("/save_plot/{token}")
async def save_plot_route(request: Request, token: str):
    req = await request.json()
    return save_plot(req, token)

@app.get("/saved_plots/{token}")
async def saved_plots_route(token: str):
    return saved_plots(token)

@app.post("/get_saved_plot/{token}")
async def get_saved_plot_route(request: Request, token: str):
    req = await request.json()
    return get_saved_plot(req, token)

@app.get("/example_plots")
async def example_plots_route():
    return example_plots()

@app.post("/delete_saved_plot/{token}")
async def delete_saved_plot_route(request: Request, token: str):
    req = await request.json()
    return delete_saved_plot(req, token)

@app.get("/delete_account/{token}")
async def delete_account_route(token: str):
    return delete_account(token)

@app.get("/read_report/{report}")
async def read_report_route(report: str):
    return read_report(report)
