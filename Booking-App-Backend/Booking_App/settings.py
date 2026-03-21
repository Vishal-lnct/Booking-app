from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

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
    'django.middleware.csrf.CsrfViewMiddleware',
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
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
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
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}


# ================== CORS ==================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "origin",
    "x-csrftoken",
    "x-requested-with",
]


# ================== STATIC & MEDIA ==================
STATIC_URL = 'static/'
MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ================== DEFAULT FIELD ==================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'