class LocalStorage {
  static setItem(key: string, item: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, item);
      } catch (e) {
        console.warn('LocalStorage access failed:', e);
      }
    }
  }

  static getItem(key: string) {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('LocalStorage access failed:', e);
        return null;
      }
    }
    return null;
  }

  static removeItem(key: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage access failed:', e);
      }
    }
  }
}

export default LocalStorage;
