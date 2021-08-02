errorCB = (err) => {
    console.log("error: ", err);
    this.updateProgress("Error: " + (err.message || err));
    return false;
};

successCB = () => {
    console.log("SQL executed ...");
};

openCB = () => {
    this.updateProgress("Database OPEN");
};

closeCB = () => {
    this.updateProgress("Database CLOSED");
};

export const populateDB = (tx) => {
    this.updateProgress("Executing DROP stmts");

    tx.executeSql('DROP TABLE IF EXISTS Employees;');
    tx.executeSql('DROP TABLE IF EXISTS Offices;');
    tx.executeSql('DROP TABLE IF EXISTS Departments;');

    this.updateProgress("Executing CREATE stmts");

    tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
        + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Departments( '
        + 'department_id INTEGER PRIMARY KEY NOT NULL, '
        + 'name VARCHAR(30) ); ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Offices( '
        + 'office_id INTEGER PRIMARY KEY NOT NULL, '
        + 'name VARCHAR(20), '
        + 'longtitude FLOAT, '
        + 'latitude FLOAT ) ; ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Employees( '
        + 'employe_id INTEGER PRIMARY KEY NOT NULL, '
        + 'name VARCHAR(55), '
        + 'office INTEGER, '
        + 'department INTEGER, '
        + 'custom_info TEXT DEFAULT "",'
        + 'FOREIGN KEY ( office ) REFERENCES Offices ( office_id ) '
        + 'FOREIGN KEY ( department ) REFERENCES Departments ( department_id ));', []);

    this.updateProgress("Executing INSERT stmts");

    tx.executeSql('INSERT INTO Departments (name) VALUES ("Client Services");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Investor Services");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Shipping");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Direct Sales");', []);

    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Denver", 59.8,  34.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Warsaw", 15.7, 54.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Berlin", 35.3, 12.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Paris", 10.7, 14.);', []);

    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Sylvester Stallone", 2, 4, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Elvis Presley", 2, 4, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Leslie Nelson", 3, 4, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Fidel Castro", 3, 3, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Bill Clinton", 1, 3, '{"known": false}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Margaret Thatcher", 1, 3, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Donald Trump", 2, 4, '{"known": true, "impeached": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Dr DRE", 2, 2, '{"known": true}')`, []);
    tx.executeSql(`INSERT INTO Employees (name, office, department, custom_info) VALUES ("Samantha Fox", 2, 1, '{"known": true}')`, []);

    console.log("all config SQL done");
};

export const populateDatabase = (db) => {
    this.updateProgress("Database integrity check");
    db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
        () => {
            this.updateProgress("Database is ready ... executing query ...");
            db.transaction(this.queryEmployees, this.errorCB, () => {
                this.updateProgress("Processing completed");
            });
        },
        (error) => {
            console.log("received version error:", error);
            this.updateProgress("Database not yet ready ... populating data");
            db.transaction(this.populateDB, this.errorCB, () => {
                this.updateProgress("Database populated ... executing query ...");
                db.transaction(this.queryEmployees, this.errorCB, () => {
                    console.log("Transaction is now finished");
                    this.updateProgress("Processing completed");
                    this.closeDatabase();
                });
            });
        });
};