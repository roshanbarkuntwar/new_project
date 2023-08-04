(function () {

    angular.module('starter').factory('pouchDBService', ['$q', pouchDBService]);

    function pouchDBService($q) {
        var _db;
        var _jsonDataForDashBord;

        return {
            initDB: initDB,
            getAllJSON: getAllJSON,
            addJSON: addJSON,
            updateJSON: updateJSON,
            deleteJSON: deleteJSON,
            deleteDB: deleteDB,
            getObject: getObject
        };

        function initDB() {
            // Creates the database or opens if it already exists, {adapter: 'websql'}
            _db = new PouchDB('localDB', { revs_limit: 1, auto_compaction: true });

        };

        function addJSON(JSON) {
            return $q.when(_db.post(JSON));
        };

        function updateJSON(JSON) {
            if (JSON) {
                return $q.when(_db.put(JSON, function (doc) {
                    return "doc";

                }))
            }
        };

        function deleteJSON(JSON) {
            return $q.when(_db.remove(JSON));
        };

        function deleteDB() {
            _db.destroy(function (err, response) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log("Database Deleted");
                }
            });
        };

        function getObject(id) {
            if (id == "" || id == undefined) { } else {
                if (_db) {
                    return $q.when(_db.get(id, function (doc) {
                        return doc;
                    }))
                }
            }
        }

        function getAllJSON() {
            if (!_jsonDataForDashBord) {
                return $q.when(_db.allDocs({ include_docs: true }))
                    .then(function (docs) {

                        // Each row has a .doc object and we just want to send an 
                        // array of JSON objects back to the calling controller,
                        // so let's map the array to contain just the .doc objects.
                        _jsonDataForDashBord = docs.rows.map(function (row) {
                            // Dates are not automatically converted from a string.
                            // row.doc.Date = new Date(row.doc.Date);
                            // alert("Date" + row.doc.Date) ;
                            return row.doc;
                        });

                        // Listen for changes on the database.
                        _db.changes({ live: true, since: 'now', include_docs: true })
                            .on('change', onDatabaseChange);
                        // alert("return _JSON") ;  
                        return _jsonDataForDashBord;
                    });
            } else {
                // Return cached data as a promise
                return $q.when(_jsonDataForDashBord);
            }
        };

        function onDatabaseChange(change) {
            var index = findIndex(_jsonDataForDashBord, change.id);
            var JSON = _jsonDataForDashBord[index];

            if (change.deleted) {
                if (JSON) {
                    _jsonDataForDashBord.splice(index, 1); // delete
                    // alert("delete") ;
                }
            } else {
                if (JSON && JSON._id === change.id) {
                    _jsonDataForDashBord[index] = change.doc; // update
                    // alert("update") 
                } else {
                    _jsonDataForDashBord.splice(index, 0, change.doc)
                    // alert("insert") // insert
                }
            }
        }

        function findIndex(array, id) {
            var low = 0,
                high = array.length,
                mid;
            while (low < high) {
                mid = (low + high) >>> 1;
                array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
        }
    }
})();