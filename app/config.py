import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://u10_f4KF0ZjgLF:LP4myZ6R%2B8g!ditrP!iv2XFJ@193.111.249.78:3306/s10_DeepScheduleDEV"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 280
    }