from pathlib import Path
import os
import cloudinary
import cloudinary.api
import cloudinary.uploader

BASE_DIR = Path(__file__).resolve().parent.parent

# ================== BASIC ==================
SECRET_KEY = 'django-insecure-fca+(383w*r4(u+nb$=uclv&cbmp6jdu%=dubygp@84tk-!=rf'

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# ================== INSTALLED APPS ==================
INSTALLED_APPS = [
    'corsheaders',
    'cloudinary',
    'cloudinary_storage',
    'rest_framework',
    'rest_framework.authtoken',
    'RoomBooking',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]



##templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],   # you can add templates folder later
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

# ================== MIDDLEWARE ==================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ================== URL CONFIG ==================
ROOT_URLCONF = 'Booking_App.urls'

WSGI_APPLICATION = 'Booking_App.wsgi.application'


# ================== DATABASE ==================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ================== AUTH ==================
AUTH_USER_MODEL = 'RoomBooking.User'
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend'
]


# ================== REST FRAMEWORK ==================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}


# ================== CORS (IMPORTANT) ==================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True


# ================== STATIC ==================
STATIC_URL = 'static/'


# ================== DEFAULT FIELD ==================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ================== CLOUDINARY ==================
cloudinary.config(
    cloud_name="dxbm4jutk",
    api_key="154477864673916",
    api_secret="JepRjLTqD_kDGP6XN-jjYFjKK3U",
    secure=True,
)

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'dxbm4jutk',
    'API_KEY': '154477864673916',
    'API_SECRET': 'JepRjLTqD_kDGP6XN-jjYFjKK3U',
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'