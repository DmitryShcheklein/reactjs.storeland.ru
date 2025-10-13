import dotenv from 'dotenv';
import path from 'path';

const envPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve('env/production/.env')
    : path.resolve('env/development/.env');

dotenv.config({ path: envPath });

const { CURRENT_SITE, SECRET_KEY, PORT, API_BASE_URL } = process.env;

const FoldersNames = {
  Html: 'html',
  Images: 'images',
  Fonts: 'fonts',
  Js: 'js',
  Css: 'css',
  Icons: 'icons',
};

const FilesExtensions = {
  Htm: 'htm',
  Html: 'html',
  Images: 'png, jpg, jpeg, gif',
  Fonts: 'eot, ttf, woff, woff2',
  Js: 'js',
  Css: 'css',
  Icons: 'svg',
};

const API_ENDPOINTS = {
  save: `${CURRENT_SITE}${API_BASE_URL}/save`,
  getList: `${CURRENT_SITE}${API_BASE_URL}/get_list`,
  getFile: `${CURRENT_SITE}${API_BASE_URL}/get`,
};

const BASE_DIR = 'src';
const DIST_DIR = 'dist';
const STATIC_DIR = `${DIST_DIR}/static`;
const DOWNLOAD_DIR = 'downloads';
const DEFAULT_FOLDER_NAME = `default`;

const FILE_HTML_TEMPLATE_NAME = 'template-variables.json';

const Paths = {
  dist: `${DIST_DIR}/**/*.*`,

  htm: {
    src: `${BASE_DIR}/${FoldersNames.Html}`,
    watch: `${BASE_DIR}/${FoldersNames.Html}/**/*.${FilesExtensions.Htm}`,
    dest: `${DIST_DIR}/${FoldersNames.Html}`,
    build: `${BASE_DIR}/${FoldersNames.Html}/**/*.${FilesExtensions.Htm}`,
  },

  htmlTemplate: {
    src: `${BASE_DIR}/${FoldersNames.Html}`,
    watch: `${BASE_DIR}/${FoldersNames.Html}/**/*.${FilesExtensions.Html}`,
    build: `${BASE_DIR}/${FoldersNames.Html}/**/*.${FilesExtensions.Html}`,
  },

  htmlTemplateJson: {
    default: `${BASE_DIR}/${FoldersNames.Html}/data/${FILE_HTML_TEMPLATE_NAME}`,
    watch: `${BASE_DIR}/${FoldersNames.Html}/**/*.json`,
  },

  scripts: {
    watch: `${BASE_DIR}/**/*.${FilesExtensions.Js}`,
    dest: STATIC_DIR,
    build: `${BASE_DIR}/${FoldersNames.Js}/**/*.${FilesExtensions.Js}`,
  },
  styles: {
    watch: `${BASE_DIR}/${FoldersNames.Css}/**/*.${FilesExtensions.Css}`,
    dest: STATIC_DIR,
    build: `${BASE_DIR}/${FoldersNames.Css}/**/*.${FilesExtensions.Css}`,
  },
  fonts: {
    watch: `${BASE_DIR}/${FoldersNames.Fonts}/**/*.{${FilesExtensions.Fonts}}`,
    dest: STATIC_DIR,
  },
  images: {
    watch: `${BASE_DIR}/${FoldersNames.Images}/**/*.{${FilesExtensions.Images}}`,
    dest: STATIC_DIR,
  },
  icons: {
    watch: `${BASE_DIR}/${FoldersNames.Icons}/**/*.{${FilesExtensions.Icons}}`,
    dest: STATIC_DIR,
  },
};

const Config = {
  CURRENT_SITE,
  SECRET_KEY,
  PORT,
  API_BASE_URL,
  FoldersNames,
  FilesExtensions,
  Paths,
  ApiUrls: API_ENDPOINTS,
  env: {
    isProd: process.env.NODE_ENV === 'production',
  },
  dirs: {
    BASE_DIR,
    DIST_DIR,
    STATIC_DIR,
    DOWNLOAD_DIR,
    DEFAULT_FOLDER_NAME,
  },
};

export default Config;
