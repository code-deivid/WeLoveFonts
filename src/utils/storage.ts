/*
 * localStorage puede lanzar excepciones (modo privado de algunos navegadores,
 * almacenamiento bloqueado o cuota llena). Las preferencias de la app no son
 * críticas, así que en ese caso simplemente no se guardan.
 */

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Sin persistencia disponible: la preferencia solo dura esta sesión.
  }
}
