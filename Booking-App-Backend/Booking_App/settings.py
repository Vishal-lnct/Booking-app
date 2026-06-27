from pathlib import Path
from dotenv import load_dotenv
import os

# ================== BASE ==================
BASE_DIR = Path(__file__).resolve().parent.parent

# ================== LOAD ENV ==================
load_dotenv()

# ================== BASIC ==================
SECRET_KEY = 'django-insecure-fca+(383w*r4(u+nb$=uclv&cbmp6jdu%=dubygp@84tk-!=rf'

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# ================== INSTALLED APPS ==================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',

    'RoomBooking',
]


# ================== MIDDLEWARE ==================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',

    # 'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ================== TEMPLATES ==================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ================== URL CONFIG ==================
ROOT_URLCONF = 'Booking_App.urls'

WSGI_APPLICATION = 'Booking_App.wsgi.application'


# ================== DATABASE ==================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# ================== AUTH ==================
AUTH_USER_MODEL = 'RoomBooking.User'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]


# ================== REST FRAMEWORK ==================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}


# ================== CORS ==================
CORS_ALLOW_ALL_ORIGINS = True


# ================== STATIC ==================
STATIC_URL = 'static/'


# ================== MEDIA ==================
MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# ================== DEFAULT FIELD ==================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ================== EMAIL CONFIG ==================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'

EMAIL_PORT = 587

EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")

EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER