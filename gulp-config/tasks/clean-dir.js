import { deleteSync } from 'del';

async function cleanDir(src = '') {
  if (!src) {
    console.error('Необходимо указать путь для очистки');
    return;
  }
  deleteSync(src, { force: true });
}

export default cleanDir;
