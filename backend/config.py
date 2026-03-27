from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    DATABASE_URL: str = ""
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app", "https://*.render.com"]
    
    class Config:
        env_file = ".env"


settings = Settings()
