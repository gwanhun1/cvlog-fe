class Sessionstorage {
  static setItem(key: string, item: string) {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(key, item);
      } catch (e) {
        console.warn('SessionStorage access failed:', e);
      }
    }
  }

  static getItem(key: string) {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(key);
      } catch (e) {
        console.warn('SessionStorage access failed:', e);
        return null;
      }
    }
    return null;
  }

  static removeItem(key: string) {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn('SessionStorage access failed:', e);
      }
    }
  }
}

export default Sessionstorage;
