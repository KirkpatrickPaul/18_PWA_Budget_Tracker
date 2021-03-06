//this file is taken from class-repo/18-PWA/01-Activites/23-Stu-Mini-Project/Solved/client/assets/js/indexedDB.js

function useIndexedDB(databaseName, storeName, method, object) {
  return new Promise((resolve, reject) => {
    console.log('useIndexedDB', method);
    const request = window.indexedDB.open(databaseName, 3);
    let db, tx, store;

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: '_id' });
    };

    request.onerror = function (e) {
      console.log('There was an error');
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log('error');
      };
      if (method === 'put') {
        store.put(object);
      } else if (method === 'get') {
        const all = store.getAll();
        all.onsuccess = function () {
          resolve(all.result);
        };
      } else if (method === 'delete') {
        store.delete(object._id);
      }
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
